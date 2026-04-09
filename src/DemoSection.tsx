import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  RefreshCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function DemoSection() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeSymptoms = async (base64Image: string) => {
    setLoading(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // PROMPT IN ENGLISH: Focused on itching, licking, and environmental/food triggers
      const prompt = `
        Act as an expert canine health assistant. The user is concerned because their dog has symptoms of itching, paw licking, or skin irritation.
        
        If the image is a food ingredient label:
        1. Look for common allergy triggers (Chicken, Wheat, Corn, Soy, artificial dyes, BHA/BHT).
        2. Explain why these ingredients might be causing the scratching.
        
        If the image shows the dog or an irritated area (or if it is not a label):
        1. Mention common possible causes (Seasonal allergies, mites, contact irritation, or diet).
        
        IMPORTANT: Always provide a structured JSON response in this exact format:
        {
          "status": "warning" or "safe",
          "title": "Short title of the finding",
          "summary": "2-line summary of the possible cause",
          "findings": [
            {"item": "Ingredient name or environmental factor", "risk": "high" or "medium", "reason": "Why it causes itching"}
          ],
          "nextSteps": "Brief advice on what to do next"
        }
        Do not include markdown, only raw JSON. All text values MUST be in English.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: "image/jpeg"
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      const parsedResult = JSON.parse(text.replace(/```json|```/g, ''));
      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError("I couldn't analyze the image. Please make sure it's clear and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        analyzeSymptoms(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Itch & Trigger Analyzer</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload a photo of their current food or describe the area where they scratch. Our AI will look for irritants and common factors that could be causing their discomfort.
        </p>
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-3 border-dashed border-gray-200 rounded-[32px] p-12 text-center hover:border-orange-500 hover:bg-orange-50/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="bg-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload a photo of the label or affected area</h3>
            <p className="text-gray-500 mb-8 font-medium">JPG or PNG. Clear lighting recommended.</p>
            <button className="bg-[#1a1a1a] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
              Select Image
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-2xl shadow-black/5 border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 bg-gray-50">
              <div className="relative rounded-2xl overflow-hidden aspect-square mb-4 shadow-inner">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                {loading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                      <p className="font-bold">Analyzing triggers...</p>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-orange-600 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" /> Try with another image
              </button>
            </div>

            <div className="p-8">
              {error && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${
                    result.status === 'warning' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {result.status === 'warning' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider">{result.title}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-8 font-medium italic">"{result.summary}"</p>

                  <div className="space-y-4 mb-8">
                    {result.findings.map((finding: any, idx: number) => (
                      <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex gap-4">
                        <div className={`w-2 h-auto rounded-full ${
                          finding.risk === 'high' ? 'bg-red-500' : 'bg-orange-400'
                        }`} />
                        <div>
                          <div className="font-bold text-gray-900">{finding.item}</div>
                          <div className="text-sm text-gray-500">{finding.reason}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      <span className="font-bold text-orange-900">Recommended Next Step</span>
                    </div>
                    <p className="text-orange-800 text-sm leading-relaxed">
                      {result.nextSteps}
                    </p>
                  </div>
                </div>
              )}

              {!result && !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Waiting for results...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start">
        <Info className="w-6 h-6 text-blue-600 shrink-0" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Important Note:</strong> This tool uses artificial intelligence to identify patterns and possible irritants. It does not replace a professional veterinary diagnosis. Always consult your veterinarian if symptoms persist.
        </p>
      </div>
    </div>
  );
}

export default DemoSection;