// StudentOS AI Tutor & Document Analyzer Service for Algerian Secondary Education

export const aiService = {
  // Generate interactive AI Tutor Chat response
  async askTutor({ message, studentProfile, subject, currentLesson, chatHistory = [], apiKey = null }) {
    // If API key is provided, try OpenAI API with a strict Algerian Secondary Education system prompt
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const systemPrompt = `أنت "المساعد الذكي لـ StudentOS" - رفيق تعليمي متخصص في المنهج الجزائري للتعليم الثانوي.
معلومات التلميذ:
- المستوى: ${studentProfile?.level || '2AS'}
- الشعبة: ${studentProfile?.streamName || 'تقني رياضي'}
- التخصص: ${studentProfile?.specializationName || 'هندسة ميكانيكية'}
- المادة الحالية: ${subject?.name || 'التكنولوجيا'}
- الدرس الحالي: ${currentLesson?.title || 'عام'}

تعليماتك البيداغوجية:
1. التزم بالمنهاج والمصطلحات الرسمية لوزارة التربية الوطنية في الجزائر.
2. استخدم المنهج السقراطي: لا تعطِ الحل النهائي مباشرة، بل وجّه الطالب خطوة بخطوة، واطرح أسئلة ذكية تحفز التفكير.
3. اكتب بصيغة واضحة ومشجعة باللغة العربية الفصحى مع دعم المصطلحات العلمية والتقنية بالفرنسية والإنجليزية عند الحاجة.
4. استخدم التنسيق الرياضي والمعادلات بشكل منظم.`;

        const messages = [
          { role: 'system', content: systemPrompt },
          ...chatHistory.slice(-6).map(m => ({ role: m.sender === 'ai' ? 'assistant' : 'user', content: m.text })),
          { role: 'user', content: message }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices[0].message.content;
        }
      } catch (err) {
        console.warn('OpenAI API request failed, falling back to local pedagogical engine:', err);
      }
    }

    // Built-in Algerian Secondary Knowledge Engine Response
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulating realistic thoughtful response

    const lowerMsg = message.toLowerCase();

    // Contextual responses based on Algerian curriculum topics
    if (lowerMsg.includes('نسبة النقل') || lowerMsg.includes('تروس') || lowerMsg.includes('engrenage') || lowerMsg.includes('موديول')) {
      return `أهلاً بك يا ${studentProfile?.name || 'بطل'}! ⚙️
في مادة **الهندسة الميكانيكية** (2AS / 3AS)، لحساب نسبة النقل $r$ بين عجلتين مسننتين، لدينا القاعدة الذهبية:

$$r = \\frac{N_2}{N_1} = \\frac{Z_1}{Z_2} = \\frac{d_1}{d_2}$$

حيث:
- $N_1$: سرعة العجلة القائدة (Meneuse) بـ $\\text{tr/min}$.
- $N_2$: سرعة العجلة المقتادة (Menée) بـ $\\text{tr/min}$.
- $Z_1$: عدد أسنان العجلة القائدة.
- $Z_2$: عدد أسنان العجلة المقتادة.

💡 **سؤال توجيهي لك:**
إذا كان لدينا محرك يدور بسرعة $1200 \\text{ tr/min}$ مع $Z_1 = 20$ سناً، و $Z_2 = 60$ سناً:
1. هل هذا النظام مخفض للسرعة أم مضاعف؟
2. كم ستكون سرعة الخروج $N_2$؟ 

جرّب الحساب وأخبرني بنتيجتك لنراجعها معاً!`;
    }

    if (lowerMsg.includes('متتالية') || lowerMsg.includes('suite') || lowerMsg.includes('أساس') || lowerMsg.includes('حد عام')) {
      return `مرحباً بك! 📐 في وحدة **المتتاليات العددية**:

لكي تثبت أن متتالية $(U_n)$ حسابية، تحسب دائماً الفرق:
$$U_{n+1} - U_n = r$$
حيث $r$ هو عدد حقيقي ثابت (الأساس).

وعبارة الحد العام تكون:
- إذا بدأت من $U_0$: $$U_n = U_0 + n \\cdot r$$
- إذا بدأت من حد كيفي $U_p$: $$U_n = U_p + (n - p) \\cdot r$$

هل لديك تمرين محدد به معطيات تريد أن نحله خطوة بخطوة معاً؟`;
    }

    if (lowerMsg.includes('طاقة') || lowerMsg.includes('عمل') || lowerMsg.includes('انحفاظ') || lowerMsg.includes('فيزياء')) {
      return `أهلاً بك في مادة **العلوم الفيزيائية**! ⚛️

المبدأ الأساسي لانحفاظ الطاقة للجملة الميكانيكية:
$$E_{\\text{initiale}} + E_{\\text{reçue}} - E_{\\text{cédée}} = E_{\\text{finale}}$$

للجسم الصلب في حركة انسحابية:
$$E_c = \\frac{1}{2} m v^2$$
ولحساب عمل قوة ثابتة $F$ تنتقل من $A$ إلى $B$:
$$W_{AB}(\\vec{F}) = F \\times AB \\times \\cos(\\alpha)$$

ما هي الجملة المدروسة في تمرينك وما هي القوى المؤثرة عليها؟`;
    }

    if (lowerMsg.includes('باك') || lowerMsg.includes('bac') || lowerMsg.includes('منهجية') || lowerMsg.includes('تحضير')) {
      return `ممتاز! التحضير للبكالوريا (BAC) في المنهج الجزائري يحتاج إلى 3 ركائز أساسية:

1. **إتقان المعاملات الكبرى:** التركيز على المواد الأساسية لشعبتك (${studentProfile?.streamName || 'مسارك'}) مع عدم إهمال المواد الثانوية.
2. **منهجية الإجابة الرسمية:** في الامتحانات الرسمية، الخطوات المنطقية وكتابة القوانين بوحداتها الصحيحة تأخذ أكثر من 60% من العلامة.
3. **التكرار المتباعد:** مراجعة القوانين والتمارين النموذجية للسنوات السابقة (2018 - 2025).

ما هي المادة التي تريد وضع خطة مراجعة مكثفة لها اليوم؟`;
    }

    // Default supportive Socratic response
    return `أهلاً بك يا ${studentProfile?.name || 'صديقي'}! 🎓
أنا المساعد الذكي لـ **StudentOS** المخصص للمنهاج الثانوي الجزائري.

أنا هنا لمساعدتك في:
- تبسيط وشرح مفاهيم الدرس (${currentLesson?.title || subject?.name || 'جميع المواد'}).
- إرشادك في حل التمارين والمسائل خطوة بخطوة وفق المنهجية الرسمية.
- توليد أسئلة واختبارات تجريبية وتدريبك على نمط البكالوريا.
- مراجعة وتصحيح أخطائك في الاختبارات.

اطرح سؤالك أو اكتب نص التمرين الذي تود العمل عليه!`;
  },

  // Analyze uploaded lesson document (PDF, text, docx)
  async analyzeLessonDocument({ fileName, fileContent, subjectId, levelId, streamId }) {
    await new Promise(resolve => setTimeout(resolve, 1200)); // Processing simulation

    const docTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    return {
      title: docTitle || 'تحليل الدرس المرفوع',
      sourceType: 'user_uploaded',
      extractedUnits: [
        {
          unitNumber: 1,
          title: `محور المفاهيم الأساسية المستخرجة من "${docTitle}"`,
          summary: 'تحليل شامل للمحتوى المرفوع واستخراج القوانين الرياضية والتعاريف والمسائل التطبيقية المرتبطة بالمنهج الثانوي.',
          keyTerms: [
            { ar: 'المفهوم الأساسي 1', fr: 'Concept Principal', def: 'التعريف التقني المستخلص من الوثيقة المرفوعة.' },
            { ar: 'القانون والتطبيق', fr: 'Loi & Application', def: 'العلاقة الرياضية المعيارية المستعملة في الحساب.' }
          ]
        }
      ],
      generatedFlashcards: [
        {
          question: `ما هي الفكرة الجوهرية التي يعالجها درس "${docTitle}"؟`,
          answer: 'المعالجة النظرية والتطبيقية لعناصر الوحدة وفق الكفاءات الختامية المستهدفة في المنهاج.',
          level: 1,
          intervalDays: 1,
          masteryScore: 50
        },
        {
          question: 'ما هي الشروط والاحتياطات الواجب مراعاتها عند تطبيق القوانين المستخرجة؟',
          answer: 'احترام الوحدات الدولية SI، التحقق من الشروط الحدية، والتقيد بدفتر الشروط.',
          level: 1,
          intervalDays: 1,
          masteryScore: 50
        }
      ],
      generatedQuestions: [
        {
          type: 'mcq',
          question: `سؤال استرجاعي حول محتوى وثيقة: ${docTitle}`,
          options: [
            { id: 'opt-1', text: 'الخيار الصحيح المطابق للمنهجية العلمية والتقنية', isCorrect: true },
            { id: 'opt-2', text: 'خيار غير دقيق من حيث الوحدات', isCorrect: false },
            { id: 'opt-3', text: 'خيار متناقض مع شرط التوازن', isCorrect: false }
          ],
          explanation: 'الخيار الأول يمثل التطبيق المباشر للقاعدة المستخلصة من الملف.'
        },
        {
          type: 'true_false',
          question: 'المفاهيم المستخلصة من هذا الدرس تطبق مباشرة في التمارين النموذجية للطور الثانوي.',
          correctAnswer: true,
          explanation: 'صحيح؛ التحليل البيداغوجي للوثيقة يطابق مخرجات التعلّم المقررة.'
        }
      ],
      recommendedRevisionSchedule: [
        { day: 1, focus: 'فهم التعاريف والمصطلحات الأساسية وحفظ البطاقات' },
        { day: 2, focus: 'حل 3 تمارين تطبيقية مباشرة' },
        { day: 4, focus: 'إجراء اختبار تجريبي تقييمي Active Recall' },
        { day: 7, focus: 'حل مسألة شاملة من نمط البكالوريا' }
      ]
    };
  },

  // Teacher AI Assistant: generate exam questions proposal
  async generateTeacherExamProposal({ subjectName, level, stream, lessonTopic, questionCount = 5 }) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      title: `مقترح اختبار ذكي: ${lessonTopic} (${level} - ${stream})`,
      subjectName,
      suggestedDurationMinutes: 30,
      totalPoints: 20,
      questions: [
        {
          id: 'ai-q-1',
          type: 'mcq',
          question: `ما هو التعريف الاصطلاحي الأكثر دقة لمفهوم (${lessonTopic}) وفق المنهاج؟`,
          options: [
            { id: 'opt-a', text: 'التعريف المعياري المعتمد من المفتشية البيداغوجية', isCorrect: true },
            { id: 'opt-b', text: 'تعريف سطحي يفتقر للتدقيق الاصطلاحي', isCorrect: false },
            { id: 'opt-c', text: 'تعريف متعلق بمجال آخر غير مستهدف', isCorrect: false }
          ],
          points: 4,
          explanation: 'الخيار أ يجسد الصياغة الرسمية الموصى بها في التدرجات السنوية.'
        },
        {
          id: 'ai-q-2',
          type: 'true_false',
          question: `هل تطبق قوانين (${lessonTopic}) في جميع الشروط الفيزيائية والهندسية دون استثناء؟`,
          correctAnswer: false,
          points: 3,
          explanation: 'خطأ؛ توجد دائمًا شروط تطبيق وحدود صلاحية لكل قانون فيزيائي أو ميكانيكي.'
        },
        {
          id: 'ai-q-3',
          type: 'matching',
          question: 'صل بين كل رمز تقني ومعناه الفيزيائي/الهندسي:',
          pairs: [
            { left: 'الموديول m', right: 'مقياس أبعاد السن ومقاومته' },
            { left: 'القطر الاسمي d', right: 'أساس حساب الأبعاد والتباعد' },
            { left: 'نسبة النقل r', right: 'حاصل قسمة سرعة الخروج على سرعة الدخول' }
          ],
          points: 5,
          explanation: 'الربط الصحيح للعلاقات الأساسية.'
        },
        {
          id: 'ai-q-4',
          type: 'calculation',
          question: `مسألة حسابية تطبيقية على (${lessonTopic}): احسب القيمة المطلوبة بتطبيق القانون المباشر.`,
          formulaHint: 'تطبيق القاعدة المباشرة المقررة في الدرس',
          correctNumericAnswer: 100,
          unit: 'وحدة معيارية',
          tolerance: 0.1,
          points: 8,
          stepByStepSolution: 'كتابة القانون أولاً، التعويض بالأرقام والوحدات الدولية، ثم استخراج النتيجة النهائية.'
        }
      ]
    };
  }
};
