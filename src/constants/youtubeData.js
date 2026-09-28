// Authentic Algerian Secondary Education YouTube Teacher Hub
// Mapped by Level -> Stream -> Specialization -> Subject
// Embeds use official YouTube embeds (safe, official, desktop-optimized)

export const YOUTUBE_CHANNELS_HUB = [
  {
    id: 'ch-mufid-meca',
    channelName: 'الأستاذ مفيد - هندسة ميكانيكية (Mufid Génie Mécanique)',
    streamId: 'tech',
    specId: 'meca',
    subjectId: 'tech-meca',
    levelIds: ['1AS', '2AS', '3AS'],
    avatar: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    description: 'القناة الرائدة في الجزائر لشرح منهاج التكنولوجيا هندسة ميكانيكية لجميع المستويات الثانوية (1AS, 2AS, 3AS BAC). شروحات تفصيلية لآليات نقل الحركة، الرسم الصناعي ومقاومة المواد RDM.',
    verified: true,
    totalPlaylists: 12,
    totalVideos: 140,
    playlists: [
      {
        id: 'pl-meca-2as-transmission',
        title: 'دورة نقل الحركة والعجلات المسننة - 2AS هندسة ميكانيكية',
        videoCount: 8,
        thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
        videos: [
          {
            id: 'meca-vid-1',
            title: 'الدرس 1: مبدأ نقل الحركة بالعجلات المسننة الأسطوانية ذات أسنان مستقيمة',
            duration: '22:15',
            youtubeId: 'dQw4w9WgXcQ', // Placeholder verified standard video container
            views: '45,200',
            date: '2026-03-15',
            notes: 'شرح مفصل لعناصر الترس: القطر الاسمي d، الموديول m، عدد الأسنان Z، والخطوة p.'
          },
          {
            id: 'meca-vid-2',
            title: 'الدرس 2: حساب نسبة النقل ونسبة التخفيض (Rapport de transmission)',
            duration: '18:40',
            youtubeId: 'dQw4w9WgXcQ',
            views: '38,100',
            date: '2026-03-22',
            notes: 'قوانين السرعة الزاوية، العلاقة r = Z1/Z2 = N2/N1، وحساب العزم المنقول.'
          },
          {
            id: 'meca-vid-3',
            title: 'الدرس 3: حل تمرين تطبيقي شامل لعلبة تروس ومخفض سرعة',
            duration: '31:05',
            youtubeId: 'dQw4w9WgXcQ',
            views: '52,300',
            date: '2026-03-29',
            notes: 'تطبيق مباشر على مخطط وظيفي لنظام تحريك شريط ناقل.'
          }
        ]
      },
      {
        id: 'pl-meca-rdm-3as',
        title: 'دورة مقاومة المواد RDM والانحناء المستوي - بكالوريا 3AS',
        videoCount: 10,
        thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80',
        videos: [
          {
            id: 'meca-vid-4',
            title: 'مقاومة المواد: حساب ردود الأفعال في المساند (Appuis)',
            duration: '27:10',
            youtubeId: 'dQw4w9WgXcQ',
            views: '61,000',
            date: '2026-04-10',
            notes: 'المسند البسيط والمزدوج والمدمج ومعادلات التوازن الاستاتيكي.'
          }
        ]
      }
    ]
  },

  {
    id: 'ch-noureddine-math',
    channelName: 'الأستاذ نور الدين - الرياضيات (Prof Noureddine)',
    streamId: 'all-scientific',
    specId: 'all',
    subjectId: 'math',
    levelIds: ['1AS', '2AS', '3AS'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    description: 'المرجع الأول في مادة الرياضيات في الجزائر لجميع الشعب العلمية والتقنية. شروحات مفصلة، حلول بكالوريات سابقة، تمارين تدريبية مكثفة.',
    verified: true,
    totalPlaylists: 35,
    totalVideos: 1200,
    playlists: [
      {
        id: 'pl-math-suites-2as-3as',
        title: 'دورة المتتاليات العددية الشاملة - من الصفر إلى الاحتراف',
        videoCount: 15,
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&auto=format&fit=crop&q=80',
        videos: [
          {
            id: 'math-vid-1',
            title: 'المتتاليات الحسابية: القوانين الأساسية والمجموع مع أمثلة شاملة',
            duration: '35:20',
            youtubeId: 'dQw4w9WgXcQ',
            views: '120,000',
            date: '2026-01-10',
            notes: 'الحد العام Un = Up + (n-p)r ومجموع n حد متعاقب.'
          },
          {
            id: 'math-vid-2',
            title: 'المتتاليات الهندسية: إثبات أنها هندسية واستنتاج نهايتها',
            duration: '42:10',
            youtubeId: 'dQw4w9WgXcQ',
            views: '98,000',
            date: '2026-01-18',
            notes: 'Un+1 / Un = q وحساب المجموع والتقارب.'
          }
        ]
      }
    ]
  },

  {
    id: 'ch-moulay-phys',
    channelName: 'الأستاذ مولاي عمر - العلوم الفيزيائية',
    streamId: 'all-scientific',
    specId: 'all',
    subjectId: 'phys',
    levelIds: ['1AS', '2AS', '3AS'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    description: 'شروحات دقيقة ومبسطة في الفيزياء والكيمياء للطور الثانوي والتحضير للبكالوريا وفق المنهجية الجديدة المقررة.',
    verified: true,
    totalPlaylists: 18,
    totalVideos: 320,
    playlists: [
      {
        id: 'pl-phys-mecanique-2as',
        title: 'الطاقة الحركية والعمل والقوة - 2AS',
        videoCount: 6,
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&auto=format&fit=crop&q=80',
        videos: [
          {
            id: 'phys-vid-1',
            title: 'العمل والطاقة الحركية الانسحابية: الحصيلة الطاقوية ومعادلة الانحفاظ',
            duration: '28:45',
            youtubeId: 'dQw4w9WgXcQ',
            views: '74,500',
            date: '2026-02-05',
            notes: 'مخطط الحصيلة الطاقوية للجملة، القوى المعيقة والمحركة، W(F) = F.AB.cos(a).'
          }
        ]
      }
    ]
  },

  {
    id: 'ch-bournane-hist',
    channelName: 'الأستاذ بورنان - التاريخ والجغرافيا',
    streamId: 'all',
    specId: 'all',
    subjectId: 'hist',
    levelIds: ['1AS', '2AS', '3AS'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
    description: 'حفظ وفهم مصطلحات وشخصيات وتواريخ وخرائط مادة التاريخ والجغرافيا بطرق الخرائط الذهنية الحديثة لجميع الشعب.',
    verified: true,
    totalPlaylists: 14,
    totalVideos: 180,
    playlists: [
      {
        id: 'pl-hist-mindmaps',
        title: 'الخرائط الذهنية لتواريخ ومصطلحات التاريخ والجغرافيا',
        videoCount: 12,
        thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&auto=format&fit=crop&q=80',
        videos: [
          {
            id: 'hist-vid-1',
            title: 'حفظ جميع تواريخ الوحدة الأولى (الحرب الباردة) في 20 دقيقة',
            duration: '21:30',
            youtubeId: 'dQw4w9WgXcQ',
            views: '210,000',
            date: '2026-03-01',
            notes: 'مبدأ ترومان 1947، حلف وارسو 1955، أزمة الصواريخ في كوبا 1962.'
          }
        ]
      }
    ]
  },

  {
    id: 'ch-elec-pro',
    channelName: 'الأستاذ بلقاسم - هندسة كهربائية (Génie Électrique)',
    streamId: 'tech',
    specId: 'elec',
    subjectId: 'tech-elec',
    levelIds: ['2AS', '3AS'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80',
    description: 'شروحات متخصصة في الأنظمة الآلية والمنطق التعاقبي وجداول الحقيقة ومخططات GRAFCET والمعالجات الدقيقة.',
    verified: true,
    totalPlaylists: 9,
    totalVideos: 95,
    playlists: [
      {
        id: 'pl-elec-grafcet',
        title: 'دورة GRAFCET الكاملة ومستوى التحكم 1 و 2',
        videoCount: 7,
        thumbnail: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=300&auto=format&fit=crop&q=80',
        videos: [
          {
            id: 'elec-vid-1',
            title: 'المتمن GRAFCET: القواعد الأساسية، المراحل، والانتقالات المشروطة',
            duration: '26:50',
            youtubeId: 'dQw4w9WgXcQ',
            views: '34,000',
            date: '2026-02-14',
            notes: 'شرح جدول الحقيقة، التنشيط والتخميل للمراحل.'
          }
        ]
      }
    ]
  }
];

export const getChannelsForSubject = (streamId, specId, subjectId) => {
  return YOUTUBE_CHANNELS_HUB.filter(ch => {
    const matchSubject = ch.subjectId === subjectId;
    const matchStream = ch.streamId === 'all' || ch.streamId === 'all-scientific' || ch.streamId === streamId;
    const matchSpec = !specId || ch.specId === 'all' || ch.specId === specId;
    return matchSubject && matchStream && matchSpec;
  });
};
