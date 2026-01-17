
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFashionAdvice = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك مستشار موضة خبير لمتجر "خالص" للملابس النسائية، أجب على هذا الاستفسار باللغة العربية بأسلوب راقٍ وجذاب: ${userPrompt}`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "عذراً، لم أتمكن من معالجة طلبك حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "نعتذر، حدث خطأ في التواصل مع المستشار الذكي.";
  }
};

/**
 * تحليل ألوان الملابس من الصورة المرفوعة
 */
export const analyzeImageColors = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1], // Remove the prefix if present
                mimeType: mimeType,
              },
            },
            {
              text: "قم بتحليل هذه القطعة من الملابس واستخرج الألوان الرئيسية السائدة فيها. أعد النتيجة كقائمة JSON تحتوي على كائنات بها 'name' (اسم اللون بالعربية الجذابة) و 'hex' (كود اللون الست عشري). استخرج 3 ألوان كحد أقصى.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              hex: { type: Type.STRING },
            },
            required: ["name", "hex"],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Color Analysis Error:", error);
    return [];
  }
};

/**
 * تحليل الأرباح المتوقعة بناءً على الجرد الحالي
 */
export const analyzeBusinessProfit = async (products: Product[]) => {
  try {
    const inventorySummary = products.map(p => ({
      name: p.name,
      cost: p.purchasePrice,
      price: p.price,
      stock: p.stock
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `بصفتك خبيراً مالياً، حلل بيانات الجرد هذه لمتجر ملابس نسائية: ${JSON.stringify(inventorySummary)}. 
      أعطني ملخصاً في 3 نقاط: 
      1. إجمالي الأرباح المتوقعة عند بيع كل المخزون.
      2. متوسط هامش الربح المئوي.
      3. نصيحة تجارية ذكية بناءً على هذه البيانات لتحسين المبيعات.
      اجعل الرد باللغة العربية وبلهجة احترافية مشجعة.`,
      config: {
        thinkingConfig: { thinkingBudget: 5000 }
      }
    });

    return response.text || "لا توجد بيانات كافية للتحليل حالياً.";
  } catch (error) {
    console.error("Profit Analysis Error:", error);
    return "تعذر إجراء التحليل المالي في الوقت الحالي.";
  }
};
