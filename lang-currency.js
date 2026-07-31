// ============================================================
// AL JUDE TRAVEL — Language & Currency Switcher v2
// Works on plain HTML — no data attributes needed
// ============================================================

const LC = {
  rates:   { JOD:1, USD:1.41, EUR:1.30, SAR:5.29, AED:5.18, QAR:5.14 },
  symbols: { JOD:'د.أ', USD:'$', EUR:'€', SAR:'ر.س', AED:'د.إ', QAR:'ر.ق' },

  lang: localStorage.getItem('lc_lang') || 'ar',
  curr: localStorage.getItem('lc_curr') || 'JOD',

  // ── Full dictionary AR → EN ─────────────────────────────
  dict: {
    // NAV
    'الرئيسية':'Home', 'العروض':'Offers', 'الباقات':'Packages',
    'فنادق ومواصلات':'Hotels & Transport', 'العمرة':'Umrah',
    'تذاكر تشارتر من الأردن':'Charter Tickets from Jordan', 'تأجير الطائرات':'Aircraft Leasing',
    'اتصل بنا':'Contact Us', 'واتساب':'WhatsApp', 'ومواصلات':'& Transport',
    'التأشيرات':'Visa Services',
    'السياحة العلاجية في الأردن':'Medical Tourism / Jordan', 'بحث عن رحلات':'Flight Search',
    // HERO - HOME
    'اكتشف جمال العالم':'Discover the Beauty of the World',
    'مع الجود للسياحة':'With AL JUDE Travel',
    'باقات سياحية شاملة، رحلات شارتر، فنادق ومواصلات، عمرة — نخدمك في 15 وجهة حول العالم بأفضل الأسعار وأعلى الجودة. رحلتك المثالية تبدأ من هنا':
      'Comprehensive travel packages, charter flights, hotels & transport, Umrah — serving you across 15 destinations worldwide at the best prices. Your perfect journey starts here.',
    'تصفح الباقات':'Browse Packages', 'تواصل معنا':'Contact Us',
    '15+ وجهة سياحية':'15+ Destinations', 'باقة وفندق':'Package & Hotel',
    'خدمة العملاء':'Customer Service', 'سنة خبرة':'Years Experience',
    'اكتشف المزيد':'Discover More',
    // SECTIONS - HOME
    'عروض مميزة':'Featured Offers',
    'أحدث العروض والتخفيضات':'Latest Offers & Deals',
    'عروض حصرية على الباقات والتذاكر — محدودة الوقت':'Exclusive deals on packages & tickets — limited time',
    'وجهاتنا':'Our Destinations',
    '15 وجهة — اختر رحلتك':'15 Destinations — Choose Your Trip',
    'باقات سياحية لكل الوجهات بأفضل الأسعار':'Travel packages for all destinations at the best prices',
    'من إسطنبول إلى بالي — رحلتك المثالية في انتظارك':'From Istanbul to Bali — your perfect trip awaits',
    'باقات مميزة':'Featured Packages', 'أفضل الباقات الآن':'Best Packages Now',
    'باقات شاملة الفندق والمواصلات وتذكرة الطيران — احجز الآن':'Packages including hotel, transport & flight — book now',
    'خدماتنا':'Our Services', 'كل ما تحتاجه في مكان واحد':'Everything You Need in One Place',
    'من التذكرة إلى الفندق إلى الجولة — نغطي كل تفاصيل رحلتك':'From ticket to hotel to tour — we cover every detail of your trip',
    'لماذا الجود':'Why AL JUDE', 'ثقتك أمانة عندنا':'Your Trust Is Our Commitment',
    '15 سنة من الخبرة في خدمة عملائنا الكرام':'15 years of experience serving our valued customers',
    '15 وجهة سياحية':'15 Destinations',
    'من تركيا إلى جنوب شرق آسيا — نصل إلى كل مكان تحلم به':'From Turkey to Southeast Asia — we reach everywhere you dream of',
    // CTA STRIP
    'جاهز لحجز رحلتك؟':'Ready to Book Your Trip?',
    'تواصل معنا الآن وفريقنا سيساعدك في تصميم رحلتك المثالية بأفضل الأسعار':'Contact us now and our team will help you design your perfect trip at the best prices',
    'واتساب — ابدأ الآن':'WhatsApp — Start Now',
    // DESTINATIONS
    'إسطنبول':'Istanbul', 'شرم الشيخ':'Sharm El-Sheikh', 'أنطاليا':'Antalya',
    'طرابزون':'Trabzon', 'العقبة':'Aqaba', 'جورجيا':'Georgia',
    'أذربيجان':'Azerbaijan', 'الغردقة':'Hurghada',
    'مصر':'Egypt', 'تركيا':'Turkey', 'السعودية':'Saudi Arabia',
    'الإمارات العربية المتحدة':'UAE', 'القاهرة':'Cairo', 'جدة':'Jeddah', 'دبي':'Dubai',
    'ماليزيا':'Malaysia', 'بالي':'Bali', 'سنغافورة':'Singapore',
    'فيتنام':'Vietnam', 'تايلاند':'Thailand', 'المالديف':'Maldives',
     'سريلانكا':'Sri Lanka',
    'الإسكندرية':'Alexandria', 'القاهرة والساحل الشمالي':'Cairo & North Coast', 'القاهرة و الإسكندرية':'Cairo & Alexandria',
    'عرض الباقات':'View Packages',
    // DEST COUNTS
    'فندق':'Hotel', 'فنادق':'Hotels', 'باقات':'Packages', 'برامج':'Programs',
    // CARDS & PRICES
    'احجز الآن':'Book Now', 'احجز الآن عبر واتساب':'Book Now via WhatsApp',
    'احجز هذا العرض':'Book This Offer', 'احجز عبر واتساب':'Book via WhatsApp',
    'احجز هذه الباقة':'Book This Package',
    'من':'from', 'السعر للشخص الواحد':'Price per person',
    '/ شخص':'/ person',     'ليالي':'Nights', 'ليلة':'Night',
    'يشمل:':'Includes:', 'يشمل':'Includes',
    'باقة سياحية':'Travel Package', 'تذكرة طيران':'Flight Ticket',
    'عرض خاص':'Special Offer', 'عرض العيد':'Eid Offer',
    'عرض':'Offer', 'مميز':'Featured',
    'أقل سعر':'Best Price',
    // BUTTONS
    'عرض جميع العروض ←':'View All Offers →',
    'عرض جميع الباقات ←':'View All Packages →',
    'تصفح الباقات ←':'Browse Packages →',
    'تصفح الفنادق ←':'Browse Hotels →',
    'تصفح الرحلات ←':'Browse Flights →',
    'تصفح العمرة ←':'Browse Umrah →',
    'تصفح العروض ←':'Browse Offers →',
    'استفسر الآن ←':'Inquire Now →',
    'استفسر الآن':'Inquire Now',
    'ابدأ محادثة الآن':'Start a Chat Now',
    'اتصل الآن':'Call Now', 'راسلنا':'Email Us',
    'إرسال عبر واتساب':'Send via WhatsApp',
    // SERVICES
    'الباقات السياحية':'Travel Packages',
    'باقات شاملة الفندق والمواصلات والتذكرة لـ 15 وجهة حول العالم':'Complete packages with hotel, transport & ticket to 15 destinations worldwide',
    'تصفح الباقات':'Browse Packages',
    'فنادق ومواصلات':'Hotels & Transport',
    'احجز فندقك ومواصلاتك بدون تذكرة طيران':'Book your hotel & transport without a flight ticket',
    'تصفح الفنادق':'Browse Hotels',
    'رحلات الشارتر':'Charter Flights',
    'رحلات مباشرة من مطار ماركا وعمان الدولي':'Direct flights from Marka & Amman International',
    'تصفح الرحلات':'Browse Flights',
    'باقات العمرة':'Umrah Packages',
    'عمرة مع فنادق مقربة من الحرمين — باص فاخر وطيران':'Umrah with hotels near the Holy Mosques — luxury bus & flights',
    'تصفح العمرة':'Browse Umrah',
    'العروض الخاصة':'Special Offers',
    'عروض العيد والمواسم والتخفيضات الحصرية':'Eid, seasonal & exclusive discounts',
    'تصفح العروض':'Browse Offers',
    'تأجير الطائرات':'Aircraft Leasing',
    'شارتر خاص للمجموعات والشركات والرحلات الخاصة':'Private charter for groups, companies & private trips',
    'استفسر الآن':'Inquire Now',
    // WHY US
    'أفضل الأسعار مضمونة':'Best Prices Guaranteed',
    'أسعار تنافسية مباشرة مع شركات الطيران والفنادق بدون وسطاء':'Competitive prices directly with airlines & hotels, no middlemen',
    'حجز فوري عبر واتساب':'Instant Booking via WhatsApp',
    'تواصل معنا واحصل على تأكيد حجزك خلال دقائق':'Contact us and get your booking confirmed in minutes',
    '15 وجهة سياحية':'15 Destinations',
    'من تركيا إلى جنوب شرق آسيا — نصل إلى كل مكان تحلم به':'From Turkey to Southeast Asia — we reach everywhere you dream of',
    'خدمة موثوقة ومضمونة':'Reliable & Guaranteed Service',
    '15+ سنة من الخبرة وآلاف العملاء الراضين في الأردن':'15+ years of experience & thousands of satisfied customers in Jordan',
    'دعم 24/7':'24/7 Support',
    'فريقنا متاح دائماً للمساعدة قبل وأثناء وبعد رحلتك':'Our team is always available to help before, during & after your trip',
    'باقات مخصصة':'Custom Packages',
    'نصمم لك برنامجاً سياحياً يناسب ميزانيتك وأذواقك':'We design a travel program that fits your budget & taste',
    // FOOTER
    'الوجهات':'Destinations', 'روابط سريعة':'Quick Links',
    'دليل المستخدم':'User Guide',
    'ماليزيا وبالي':'Malaysia & Bali',
    'عمان، المملكة الأردنية الهاشمية':'Amman, Hashemite Kingdom of Jordan',
    'سبت–خميس: 9ص–6م | جمعة: 10ص–2م':'Sat–Thu: 9AM–6PM | Fri: 10AM–2PM',
    'جميع الحقوق محفوظة':'All rights reserved',
    'الجود للسياحة والسفر — جميع الحقوق محفوظة':'AL JUDE Travel — All rights reserved',
    'جميع الحقوق محفوظة.':'All rights reserved.',
    'وكالة سياحية متخصصة في عمان، الأردن. نقدم باقات سياحية شاملة لأفضل الوجهات العالمية بأسعار تنافسية وخدمة متميزة منذ أكثر من 15 عاماً.':
      'A specialized travel agency in Amman, Jordan. We offer comprehensive packages to the best global destinations at competitive prices and distinguished service for over 15 years.',
    'الجود للسياحة والسفر':'AL JUDE Travel',
    'الجود للسياحة والسفر — عمان، الأردن':'AL JUDE Travel — Amman, Jordan',
    'عمان، الأردن':'Amman, Jordan',
    'البريد الإلكتروني':'Email',
    'الهاتف':'Phone',
    'تواصل':'Contact',
    'القائمة':'Menu',
    // PACKAGES PAGE
    'باقاتنا السياحية 2026':'Our Packages 2026',
    'سافر مع الجود':'Travel with AL JUDE',
    'بأفضل الأسعار وأعلى الجودة':'Best Prices, Highest Quality',
    'باقات شاملة الفندق والمواصلات وتذكرة الطيران — اختر الوجهة ثم عدد الليالي':
      'Packages including hotel, transport & flight — choose destination then nights',
    'التذكرة مشمولة':'Flight Included',
    'النجوم':'Stars', 'الكل':'All',
    'المنطقة':'Area',
    'ابحث عن فندق...':'Search hotel...', 'خيار':'options',
    'جاري تحميل الوجهات...':'Loading destinations...',
    'جاري تحميل الباقات...':'Loading packages...',
    'عرض':'Showing', 'باقة من أصل':'of',
    'السعر: الأقل أولاً':'Price: Lowest First',
    'السعر: الأعلى أولاً':'Price: Highest First',
    'النجوم: الأعلى أولاً':'Stars: Highest First',
    'الاسم أبجدياً':'Name A-Z',
    'السعر: الأقل':'Price: Lowest',
    'السعر: الأعلى':'Price: Highest',
    'النجوم: الأعلى':'Stars: Highest',
    'قريباً':'Coming Soon',
    'جاري إضافة باقات':'Adding packages for',
    'لا توجد باقات منشورة بعد':'No packages published yet',
    'يرجى الدخول إلى لوحة التحكم وإضافة الباقات أولاً':'Please go to the admin panel and add packages first',
    'لا توجد نتائج':'No results',
    'حاول تغيير الفلاتر أو البحث بكلمة مختلفة':'Try changing the filters or search with a different word',
    'جاري تحميل الوجهات...':'Loading destinations...',
    'لا توجد وجهات منشورة بعد':'No destinations published yet',
    'قريباً — جاري إعداد الباقات':'Coming Soon — preparing packages',
    'يرجى التواصل معنا مباشرة عبر واتساب للاستفسار عن الأسعار':'Please contact us directly via WhatsApp for price inquiries',
    'طباعة':'Print', 'تحميل PDF':'Download PDF',
    'عرض التفاصيل والأسعار':'View Details & Prices',
    'Hotel(s) · الفندق':'Hotel(s)',
    'مزدوجة':'Double',
    'باقة كاملة':'Full Package',
    // OFFERS PAGE
    'أفضل العروض التلقائية':'Best Auto Offers',
    'أفضل ':'Best ',
    'العروض التلقائية':'Auto Offers',
    'أسعار محدثة لحظياً':'Live Updated Prices',
    'أسعار محدثة لحظياً من قاعدة البيانات — أقل سعر لكل وجهة':'Live prices from database — best price per destination',
    'طباعة جميع العروض':'Print All Offers',
    'تحميل PDF جميع العروض':'Download PDF All Offers',
    'باقات سياحية':'Travel Packages',
    'طباعة الباقات':'Print Packages',
    'PDF الباقات':'Packages PDF',
    'طباعة الفنادق':'Print Hotels',
    'PDF الفنادق':'Hotels PDF',
    'طباعة الرحلات':'Print Flights',
    'PDF الرحلات':'Flights PDF',
    'جاري تحميل العروض...':'Loading offers...',
    'لا توجد عروض متاحة':'No offers available',
    'لا توجد عروض متاحة حالياً لهذه الفئة':'No offers currently available for this category',
    'حدث خطأ':'An error occurred',
    'يرجى المحاولة لاحقاً':'Please try again later',
    'رحلة شارتر':'Charter Flight',
    'فندق ومواصلات':'Hotel & Transport',
    // FLIGHTS / CHARTER PAGE
    'حجوزات طيران الشارتر':'Charter Flight Bookings',
    'رحلات الشارتر':'Charter Flights',
    'إلى أشهر الوجهات':'To Popular Destinations',
    'أسعار خاصة على رحلات الطيران المباشرة — أهلاً بكم في الجود للسياحة والسفر':
      'Special prices on direct flights — welcome to AL JUDE Travel',
    'جميع الأسعار بالدينار الأردني — يمكنك اختيار عرضها بأي عملة':
      'All prices in Jordanian Dinar — you can select any currency',
    'جاري تحميل الرحلات...':'Loading flights...',
    'جادول الرحلات —':'Flight Schedule —',
    'ذهاب وإياب':'Round Trip', 'ذهاب فقط':'One Way',
    'عودة فقط':'Return Only',
    'غير متاح':'Not Available',
    'احجز':'Book',
    'المدة':'Duration',
    'وصول:':'Arrival:',
    'ليلاً':'Night', 'فجراً':'Dawn', 'مساءً':'Evening',
    'صباحاً':'Morning', 'ظهراً':'Noon', 'بعد الظهر':'Afternoon',
    '4 أيام':'4 Days', '5 أيام':'5 Days', '8 أيام':'8 Days',
    '3 أيام':'3 Days', '6-8 أيام':'6-8 Days',
    'رحلات يومية':'Daily Flights', 'رحلات عقبة':'Aqaba Flights',
    'رحلات أسبوعية':'Weekly Flights',
    'متعددة المدن':'Multi-city',
    'المدينة المنورة':'Madinah',
    '7 كيلو أمتعة':'7 KG Luggage',
    'مطار ماركا':'Marka Airport',
    'اختر ':'Choose ',
    'عدد الليالي':'number of nights',
    'عدد':'Number ',
    'الليالي':'of nights',
    'رحلات ':'Charter ',
    'الشارتر':'Charter',
    'تأجير ':'Aircraft ',
    'الطائرات':'Leasing',
    'لكل الاحتياجات':'For All Needs',
    ' — بدون تذكرة طيران':' — Without Flight Ticket',
    ' فندق — ':' Hotel — ',
    ' ليالي':' Nights',
    'طباعة ':'Print ',
    'طباعة رحلات ':'Print Flights ',
    'تحميل PDF ':'Download PDF ',
    'تحميل PDF رحلات ':'Download PDF Flights ',
    'طباعة':'Print',
    'المدة':'Duration',
    'جدول الرحلات —':'Flight Schedule —',
    'وصول:':'Arrival:',
    'الدينار الأردني':'Jordanian Dinar',
    'متاح':'Available', 'محدود':'Limited', 'محجوزة':'Sold Out',
    'يومياً':'Daily', 'كل سبت':'Every Saturday', 'كل أربعاء':'Every Wednesday',
    'كل خميس':'Every Thursday', 'كل جمعة':'Every Friday', 'كل ثلاثاء':'Every Tuesday',
    'كل ثلاثاء وجمعة':'Every Tuesday & Friday',
    '4 رحلات يومية':'4 Daily Flights',
    'ثلاثاء وجمعة':'Tuesday & Friday',
    'سبت واثنين وأربعاء':'Saturday, Monday & Wednesday',
    'سبت، أحد، ثلاثاء، خميس':'Saturday, Sunday, Tuesday, Thursday',
    'احد وخميس':'Sunday & Thursday',
    'احد وثلاثاء وخميس':'Sunday, Tuesday & Thursday',
    'سبت، اثنين، أربعاء':'Saturday, Monday, Wednesday',
    'ثلاثاء، خميس':'Tuesday, Thursday',
    'حسب الجدولة':'Per Schedule',
    // HOTELS & TRANSPORT PAGE
    'فنادق ومواصلات فقط':'Hotels & Transport Only',
    'فنادق ومواصلات':'Hotels & Transport',
    'بدون تذكرة طيران':'Without Flight Ticket',
    'لمن لديه تذكرة طيران — احجز فندقك ومواصلاتك بأفضل الأسعار':
      'For those with a flight ticket — book your hotel & transport at the best prices',
    'الأسعار لا تشمل تذكرة الطيران — فقط الفندق والمواصلات':
      'Prices do not include flight tickets — hotel & transport only',
    'الأسعار تشمل الفندق والمواصلات فقط — تذكرة الطيران غير مشمولة':
      'Prices include hotel & transport only — flight ticket not included',
    'اختر عدد الليالي — بدون تذكرة طيران':'Choose number of nights — without flight ticket',
    'عدد الليالي — بدون تذكرة طيران':'Nights — without flight ticket',
    'النجوم:':'Stars:',
    'المنطقة:':'Area:',
    'فندق —':'Hotel —',
    'باقة —':'Package —',
    'ليالي — السعر للشخص الواحد':'Nights — Price Per Person',
    ' — السعر يتغير تلقائياً':' — Price Changes Automatically',
    'ابحث...':'Search...',
    'جاري تحميل الفنادق...':'Loading hotels...',
    'لا توجد فنادق منشورة بعد':'No hotels published yet',
    'قريباً — جاري إضافة فنادق':'Coming Soon — adding hotels',
    'يرجى التواصل معنا للاستفسار عن أسعار الفنادق':'Please contact us for hotel prices',
    'خطأ في تحميل البيانات — يرجى المحاولة لاحقاً':'Data load error — please try again later',
    'لا توجد نتائج — حاول تغيير الفلاتر أو اختر عدد ليالٍ مختلف':'No results — try changing filters or selecting different nights',
    // UMRAH PAGE
    'باقات العمرة 2025/2026':'Umrah Packages 2025/2026',
    'بأفضل الخدمات':'With Best Services',
    'فنادق مميزة في مكة المكرمة والمدينة المنورة — باص فاخر وطيران مع مرشد عربي متخصص':
      'Premium hotels in Makkah & Madinah — luxury bus & flights with Arabic guide',
    'فنادق مقربة من الحرم':'Hotels Near the Haram',
    'باص فاخر / رويال أردنية':'Luxury Bus / Royal Jordanian',
    'مرشد عربي متخصص':'Specialized Arabic Guide',
    'تأشيرة ومستندات':'Visa & Documents',
    'جميع الباقات':'All Packages',
    'طيران — رويال أردنية':'Flight — Royal Jordanian',
    'طيران — شارتر':'Flight — Charter',
    'باص فاخر':'Luxury Bus',
    'تواصل معنا لحجز باقة العمرة المثالية':'Contact us to book your perfect Umrah package',
    'فريقنا المتخصص جاهز لمساعدتك في اختيار أفضل باقة تناسب ميزانيتك وتفضيلاتك':
      'Our specialized team is ready to help you choose the best package for your budget & preferences',
    'واتساب — استفسار فوري':'WhatsApp — Instant Inquiry',
    'جاري تحميل باقات العمرة...':'Loading Umrah packages...',
    'عرض':'Showing',
    'لا توجد باقات في هذه الفئة — تواصل معنا مباشرة':'No packages in this category — contact us directly',
    'تواصل معنا مباشرة للاستفسار عن باقات العمرة':'Contact us directly for Umrah package inquiries',
    'باقة عمرة':'Umrah Package',
    'باقات العمرة':'Umrah Packages',
    'طباعة باقات العمرة':'Print Umrah Packages',
    'تحميل PDF باقات العمرة':'Download Umrah Packages PDF',
    'مكة المكرمة':'Makkah', 'المدينة المنورة':'Madinah',
    'ليالي':'Nights', 'الفنادق':'Hotels', 'الباقة تشمل':'Package Includes',
    'للشخص الواحد':'Per Person',
    'اقتصادية':'Economy', 'مميزة':'Premium',
    'PDF':'PDF',
    // AIRCRAFT LEASING PAGE
    'خدمات تأجير الطائرات':'Aircraft Leasing Services',
    'تأجير الطائرات':'Aircraft Leasing',
    'لكل الاحتياجات':'For All Needs',
    'شارتر خاص، ACMI، إيجار جاف — رحلات مجموعات وشركات وأفراد بأعلى معايير السلامة والراحة':
      'Private charter, ACMI, dry lease — group, corporate & individual flights with highest safety & comfort',
    'شارتر خاص':'Private Charter', 'إيجار جاف':'Dry Lease', 'رحلات المجموعات':'Group Flights',
    'حلول متكاملة لتأجير الطائرات':'Integrated Aircraft Leasing Solutions',
    'نوفر خدمات تأجير الطائرات لجميع الأغراض بأعلى معايير الجودة والسلامة':
      'We provide aircraft leasing services for all purposes at the highest quality & safety standards',
    'الشارتر الخاص':'Private Charter',
    'رحلات خاصة حسب الطلب — للمجموعات السياحية والشركات والأفراد':'Custom flights on demand — for tour groups, companies & individuals',
    'ACMI — إيجار مع طاقم':'ACMI — Wet Lease',
    'تأجير الطائرة مع الطاقم والصيانة والتأمين — لشركات الطيران والمشغلين':
      'Aircraft with crew, maintenance & insurance — for airlines & operators',
    'الإيجار الجاف':'Dry Lease',
    'تأجير الطائرة فقط بدون طاقم — للمشغلين الذين لديهم طاقمهم الخاص':
      'Aircraft only without crew — for operators with their own crew',
    'رحلات المجموعات':'Group Flights',
    'باقات متكاملة للمجموعات السياحية والمؤسسات والشركات':
      'Complete packages for tour groups, institutions & companies',
    'رحلات الإخلاء الطبي':'Medical Evacuation Flights',
    'طائرات مجهزة طبياً للحالات الحرجة والنقل الطبي الدولي':
      'Medically equipped aircraft for critical cases & international medical transport',
    'الطيران التجاري الخاص':'Private Commercial Aviation',
    'طائرات فاخرة للمسافرين من رجال الأعمال والشخصيات المهمة':
      'Luxury aircraft for business travelers & VIPs',
    'خبرة 15 عاماً في قطاع الطيران':'15 Years of Experience in Aviation',
    'أعلى معايير السلامة':'Highest Safety Standards',
    'جميع طائراتنا معتمدة وفق أعلى المعايير الدولية':'All our aircraft are certified to the highest international standards',
    'استجابة فورية':'Immediate Response',
    'فريق متخصص يرد على طلباتك خلال ساعات':'A specialized team responds within hours',
    'تغطية دولية':'International Coverage',
    'وجهات حول العالم — أوروبا، آسيا، أفريقيا، الخليج':'Destinations worldwide — Europe, Asia, Africa, Gulf',
    'أسعار تنافسية':'Competitive Prices',
    'نفاوض نيابة عنك للحصول على أفضل الأسعار':'We negotiate on your behalf for the best prices',
    'طلب تأجير طائرة':'Aircraft Leasing Request',
    'أرسل تفاصيل رحلتك وسيتواصل معك فريقنا خلال ساعات':'Send your trip details and our team will contact you within hours',
    'الاسم الكامل':'Full Name', 'رقم الهاتف':'Phone Number',
    'اسمك أو اسم الشركة':'Your name or company',
    'رقم الهاتف / واتساب':'Phone / WhatsApp',
    'نوع الخدمة':'Service Type',
    'عدد المسافرين':'Number of Passengers',
    'مثلاً: 150':'e.g. 150',
    'مطار المغادرة':'Departure Airport',
    'مثلاً: عمان، ماركا':'e.g. Amman, Marka',
    'مطار الوصول':'Arrival Airport',
    'مثلاً: إسطنبول، دبي':'e.g. Istanbul, Dubai',
    'تاريخ الرحلة':'Trip Date',
    'رحلة ذهاب وإياب؟':'Round Trip?',
    'ذهاب وإياب':'Round Trip', 'ذهاب فقط':'One Way',
    'متعددة الوجهات':'Multi-city',
    'تفاصيل إضافية':'Additional Details',
    'أي متطلبات خاصة — وجبات، خدمة VIP، معدات طبية، جدول الرحلة...':
      'Any special requirements — meals, VIP service, medical equipment, flight schedule...',
    'إرسال الطلب عبر واتساب':'Submit Request via WhatsApp',
    'يرجى إدخال اسمك':'Please enter your name',
    // CONTACT PAGE
    'نحن هنا لخدمتك — تواصل معنا بأي من الوسائل التالية':'We are here to serve you — contact us via any of the following',
    'هاتف':'Phone',
    'البريد الإلكتروني':'Email',
    'العنوان':'Address',
    'ساعات العمل':'Working Hours',
    'السبت — الخميس':'Saturday — Thursday',
    '9:00 صباحاً — 6:00 مساءً':'9:00 AM — 6:00 PM',
    'تواصل معنا واتساب':'Contact Us via WhatsApp',
    'أرسل استفسارك وسنرد عليك فوراً':'Send your inquiry and we will reply immediately',
    'راسلنا على واتساب':'Message us on WhatsApp',
    'موقعنا':'Our Location',
    'أرسل لنا رسالة':'Send Us a Message',
    'الاسم':'Name', 'رقم الهاتف':'Phone Number',
    'الموضوع':'Subject', 'الرسالة':'Message',
    'اسمك الكريم':'Your kind name', 'موضوع الرسالة':'Message subject',
    'اكتب رسالتك هنا...':'Write your message here...',
    'واتساب — الأسرع':'WhatsApp — Fastest',
    'للاستفسار عن الباقات والحجز الفوري — ردنا خلال دقائق':'For package inquiries & instant booking — we reply in minutes',
    'الهاتف المباشر':'Direct Phone',
    'اتصل بنا مباشرة خلال ساعات العمل — أحد أحد إلى الجمعة':'Call us directly during working hours — Sunday to Friday',
    'للاستفسارات التفصيلية والعروض المخصصة — نرد خلال 24 ساعة':'For detailed inquiries & custom offers — we reply within 24 hours',
    'مكتب الجود للسياحة والسفر — عمان، المملكة الأردنية الهاشمية':'AL JUDE Travel & Tourism — Amman, Hashemite Kingdom of Jordan',
    'عرض على الخريطة':'View on Map',
    'الأحد — الخميس':'Sunday — Thursday',
    'الجمعة':'Friday', 'السبت':'Saturday',
    'متاح 24/7':'Available 24/7', 'مغلق':'Closed',
    'موقعنا على الخريطة':'Our Location on the Map',
    'نموذج الاستفسار':'Inquiry Form',
    'الوجهة المطلوبة':'Desired Destination',
    'اختر الوجهة':'Select Destination',
    'تفاصيل الاستفسار':'Inquiry Details',
    'اكتب تفاصيل رحلتك — عدد الأشخاص، التواريخ، ميزانيتك التقريبية...':
      'Write your trip details — number of people, dates, approximate budget...',
    'تم تحويلك إلى واتساب — شكراً لتواصلك معنا!':'You have been redirected to WhatsApp — thank you for contacting us!',
    // BOOKING MODAL
    'نموذج الحجز':'Booking Form',
    'يرجى تعبئة البيانات وسيتواصل معك فريقنا للتأكيد':'Please fill in the details and our team will contact you to confirm',
    'تواريخ السفر':'Travel Dates', 'تاريخ الوصول (Check-in)':'Check-in Date',
    'تاريخ المغادرة (Check-out)':'Check-out Date',
    'تفاصيل المسافرين':'Traveler Details',
    'عدد البالغين':'Adults', 'عدد الغرف':'Rooms',
    'عدد الأطفال (2–11 سنة)':'Children (2–11 yrs)',
    'عدد الرضّع (أقل من سنتين)':'Infants (under 2)',
    'نوع الغرفة المفضّل':'Preferred Room Type',
    'توين':'Twin', 'ثلاثية':'Triple',
    'عائلية':'Family', 'مفردة':'Single',
    'طلبات خاصة أو استفسارات':'Special Requests or Inquiries',
    'أي طلبات خاصة — طابق محدد، سرير إضافي، مناسبة...':'Any special requests — specific floor, extra bed, occasion...',
    'ملاحظات إضافية':'Additional Notes',
    'إلغاء':'Cancel',
    'الوجهة':'Destination', 'تذكرة الطيران':'Flight Ticket',
    'رحلة':'Flight',
    // MISC
    'جاري التحميل...':'Loading...', 'خطأ في التحميل':'Loading Error',
    'لا توجد نتائج':'No Results', 'حاول تغيير الفلاتر':'Try changing the filters',
    'تواصل معنا':'Contact Us', 'احجز الآن':'Book Now',
    'اكتشف المزيد':'Discover More',
    'عرض جميع العروض':'View All Offers',
    'عرض جميع الباقات':'View All Packages',
  },

  // ── Init ────────────────────────────────────────────────────
  init() {
    this.injectUI();
    this.applyCurr(this.curr);
    // Apply saved language — use multiple timeouts to catch late-loading Supabase content
    if (this.lang === 'en') {
      setTimeout(() => this.applyLang('en'), 100);
      setTimeout(() => this.applyLang('en'), 600);
      setTimeout(() => this.applyLang('en'), 1500);
      setTimeout(() => this.applyLang('en'), 3000);
    }
    // Watch for new dynamic content (Supabase cards)
    this.observeDOM();
    // Force nav translation: keep trying every 500ms for 10s to catch late renders
    var attempts = 0;
    var iv = setInterval(function() {
      if (LC.lang === 'en') {
        LC.translateNav('.nav-links a, .nav-overlay a, footer a', 'en');
        LC.translateNav('.nav-inner > a, .mob-link, .wa-link', 'en');
        // Also try all <a> tags in the nav area
        document.querySelectorAll('nav a, footer a, .nav-overlay a').forEach(function(a) {
          LC.translateNavLink(a, 'en');
        });
      }
      attempts++;
      if (attempts > 20) clearInterval(iv);
    }, 500);
  },

  // ── Translate a single <a> by href (for use in polling) ────
  translateNavLink(a, lang) {
    var map = {'index.html':'الرئيسية','offers.html':'العروض','packages.html':'الباقات','hotels-transport.html':'فنادق ومواصلات','umrah.html':'العمرة','visa-services.html':'التأشيرات','flights.html':'تذاكر تشارتر من الأردن','/medical.tourism/':'السياحة العلاجية في الأردن','flight-search.html':'✈ بحث عن رحلات','/leasing/':'تأجير الطائرات','contact.html':'اتصل بنا'};
    var enMap = {'الرئيسية':'Home','العروض':'Offers','الباقات':'Packages','فنادق ومواصلات':'Hotels & Transport','العمرة':'Umrah','التأشيرات':'Visa Services','تذاكر تشارتر من الأردن':'Charter Tickets from Jordan','السياحة العلاجية في الأردن':'Medical Tourism / Jordan','✈ بحث عن رحلات':'✈ Flight Search','تأجير الطائرات':'Aircraft Leasing','اتصل بنا':'Contact Us'};
    var href = a.getAttribute('href');
    var arTxt = map[href];
    if (!arTxt) return;
    for (var i = 0; i < a.childNodes.length; i++) {
      var n = a.childNodes[i];
      if (n.nodeType !== 3) continue;
      var txt = n.nodeValue.trim();
      if (!txt || txt.length < 1) continue;
      if (lang === 'en' && txt === arTxt) {
        n.nodeValue = enMap[arTxt];
      } else if (lang === 'ar' && txt === enMap[arTxt]) {
        n.nodeValue = arTxt;
      }
    }
  },

  // ── Direct dictionary lookup (respects current language) ────
  t(ar) {
    if (!ar || typeof ar !== 'string') return ar;
    if (this.lang === 'ar') return ar;
    return this.dict[ar] || this.dict[ar.trim()] || ar;
  },

  // ── Translate all text nodes in a container ─────────────────
  translateNodes(root, lang) {
    const isEn = lang === 'en';
    const skipTags = new Set(['SCRIPT','STYLE','META','LINK','NOSCRIPT','INPUT','TEXTAREA']);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (skipTags.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('#lc-bar,#bk-overlay,script,style')) return NodeFilter.FILTER_REJECT;
        const txt = node.textContent.trim();
        if (!txt || txt.length < 2) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(node => {
      const trimmed = node.textContent.trim();
      if (!trimmed) return;

      if (isEn) {
        if (!node._lc_ar && /[\u0600-\u06FF]/.test(trimmed)) node._lc_ar = trimmed;
        if (node._lc_ar) {
          // Strip non-Arabic prefix (emoji flags, icons, numbers) for dict lookup
          const arabicPart = node._lc_ar.replace(/^[^\u0600-\u06FF]+/, '');
          const enFull = this.dict[node._lc_ar];
          const enPart = this.dict[arabicPart];
          if (enFull) {
            // Full text matched (e.g. "4 أيام" → "4 Days") — use directly
            node.textContent = node.textContent.replace(node._lc_ar, enFull);
          } else if (enPart) {
            // Only Arabic part matched (e.g. "🇹🇷 إسطنبول") — preserve prefix
            const prefix = node._lc_ar.slice(0, node._lc_ar.length - arabicPart.length);
            node.textContent = node.textContent.replace(node._lc_ar, prefix + enPart);
          }
        }
      } else {
        // Restore Arabic
        if (node._lc_ar) {
          node.textContent = node.textContent.replace(node.textContent.trim(), node._lc_ar);
        }
      }
    });
  },

  // ── Translate element attributes (placeholder, aria-label) ──
  translateAttrs(root, lang) {
    const isEn = lang === 'en';
    // Save originals on first pass (regardless of direction)
    root.querySelectorAll('[placeholder],[aria-label]').forEach(el => {
      ['placeholder','aria-label'].forEach(attr => {
        const val = el.getAttribute(attr);
        if (!val || !/[\u0600-\u06FF]/.test(val)) return;
        if (!el._lc_attrs) el._lc_attrs = {};
        if (!el._lc_attrs[attr]) el._lc_attrs[attr] = val;
      });
    });
    // Translate or restore
    root.querySelectorAll('[placeholder],[aria-label]').forEach(el => {
      ['placeholder','aria-label'].forEach(attr => {
        const orig = el._lc_attrs && el._lc_attrs[attr];
        if (!orig) return;
        if (isEn) {
          const en = this.dict[orig] || this.dict[orig.trim()];
          if (en) el.setAttribute(attr, en);
        } else {
          el.setAttribute(attr, orig);
        }
      });
    });
  },

  // ── Apply language ──────────────────────────────────────────
  applyLang(lang) {
    this.lang = lang;
    localStorage.setItem('lc_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.translateNodes(document.body, lang);
    this.translateAttrs(document.body, lang);
    this.translateNav('.nav-links a, .nav-overlay a, footer a', lang);
    const btn = document.getElementById('lc-lang-btn');
    if (btn) btn.textContent = lang === 'ar' ? 'EN' : 'عربي';
    document.body.style.fontFamily = "'Cairo', sans-serif";
  },

  // ── Nav link translation by href (reliable — explicit AR↔EN pairs) ──
  translateNav: function(selector, lang) {
    document.querySelectorAll(selector).forEach(function(a) {
      LC.translateNavLink(a, lang);
    });
  },

  // ── Toggle language ─────────────────────────────────────────
  toggleLang() {
    const newLang = this.lang === 'ar' ? 'en' : 'ar';
    // On toggle to Arabic: clear the stored _lc_ar so fresh re-read works next time
    this.applyLang(newLang);
  },

  // ── Apply currency ──────────────────────────────────────────
  applyCurr(curr) {
    this.curr = curr;
    localStorage.setItem('lc_curr', curr);
    document.querySelectorAll('[data-jod]').forEach(el => {
      const jod = parseFloat(el.dataset.jod);
      if (!isNaN(jod)) el.textContent = this.formatPrice(jod);
    });
    document.querySelectorAll('[data-curr-sym]').forEach(el => {
      el.textContent = this.symbols[curr];
    });
    const sel = document.getElementById('lc-curr-sel');
    if (sel) sel.value = curr;
  },

  // ── Format price ────────────────────────────────────────────
  formatPrice(jod, curr) {
    curr = curr || this.curr;
    const sym = this.symbols[curr];
    const val = jod * this.rates[curr];
    const rounded = curr === 'JOD' ? Math.round(val) : Math.round(val * 10) / 10;
    const fmtd = rounded.toLocaleString('en');
    return sym + ' ' + fmtd;
  },

  // ── Watch for new dynamic content (Supabase cards) ──────────
  observeDOM() {
    let timer = null;
    const obs = new MutationObserver(() => {
      if (this.lang !== 'en') return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.translateNodes(document.body, 'en');
        this.translateNav('.nav-links a, .nav-overlay a, footer a', 'en');
      }, 80);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  },

  // ── Inject UI (lang button + currency dropdown) ─────────────
  injectUI() {
    const style = `
    .lc-bar{display:flex;align-items:center;gap:6px;flex-shrink:0}
    #lc-lang-btn{padding:6px 13px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);border-radius:8px;color:#C9A84C;font-family:'Cairo',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:all .2s;letter-spacing:.5px;white-space:nowrap}
    #lc-lang-btn:hover{background:rgba(201,168,76,.3)}
    #lc-curr-sel{padding:6px 10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#f0ede8;font-family:'Cairo',sans-serif;font-size:12px;font-weight:700;cursor:pointer;outline:none;transition:border-color .2s}
    #lc-curr-sel:hover,#lc-curr-sel:focus{border-color:rgba(201,168,76,.4)}
    #lc-curr-sel option{background:#0f1f3d;color:#f0ede8}
    @media(max-width:600px){#lc-lang-btn{padding:5px 9px;font-size:11px}#lc-curr-sel{font-size:11px;padding:5px 7px}}
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    const ui = `<div class="lc-bar" id="lc-bar">
      <button id="lc-lang-btn" onclick="LC.toggleLang()">${this.lang === 'ar' ? 'EN' : 'عربي'}</button>
      <select id="lc-curr-sel" onchange="LC.applyCurr(this.value)">
        <option value="JOD" ${this.curr==='JOD'?'selected':''}>JOD 🇯🇴</option>
        <option value="USD" ${this.curr==='USD'?'selected':''}>USD 🇺🇸</option>
        <option value="SAR" ${this.curr==='SAR'?'selected':''}>SAR 🇸🇦</option>
        <option value="AED" ${this.curr==='AED'?'selected':''}>AED 🇦🇪</option>
        <option value="QAR" ${this.curr==='QAR'?'selected':''}>QAR 🇶🇦</option>
        <option value="EUR" ${this.curr==='EUR'?'selected':''}>EUR 🇪🇺</option>
      </select>
    </div>`;

    const target = document.querySelector('.nav-actions, .nav-inner');
    if (target) target.insertAdjacentHTML('beforeend', ui);
  }
};

// ── Boot ────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LC.init());
} else {
  LC.init();
}

// ── Global price helper (call from card builders) ───────────────
function lcPrice(jod) {
  return LC.formatPrice(jod);
}
