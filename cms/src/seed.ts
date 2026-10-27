import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

// Початкові дані створюються лише коли відповідного запису ще немає.
async function seed() {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    throw new Error('Заповніть DATABASE_URL та PAYLOAD_SECRET у cms/.env')
  }
  const payload = await getPayload({ config })
  async function ensure(collection: 'epochs' | 'philosophers' | 'quotes', data: Record<string, unknown>) {
    const slug = String(data.slug)
    const found = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
    if (found.docs.length) return found.docs[0].id
    const created = await payload.create({ collection, data: data as never, overrideAccess: true })
    return created.id
  }

  const eras = [
    { slug:'antiquity', title:'Антична філософія', period:'VI ст. до н. е. — V ст. н. е.', description:'В античних полісах розум почав шукати пояснення природи, справедливості та доброго життя.', detail:'Сократ розвивав мистецтво запитання, Платон досліджував світ ідей, а Арістотель систематизував знання.', imageUrl:'/assets/antiquity.svg' },
    { slug:'medieval', title:'Середньовічна філософія', period:'V — XV століття', description:'Мислителі осмислювали зв’язок віри й розуму, природу людини та питання Бога.', detail:'Августин і Тома Аквінський по-різному поєднували філософську аргументацію з теологією.', imageUrl:'/assets/medieval.svg' },
    { slug:'renaissance', title:'Відродження', period:'XIV — XVI століття', description:'Інтерес до античності, мистецтва й особистості відкрив нові способи дивитися на людину.', detail:'Гуманісти наголошували на освіті, гідності й творчому потенціалі людини.', imageUrl:'/assets/renaissance.svg' },
    { slug:'modern', title:'Новий час', period:'XVII — XIX століття', description:'Раціоналізм, емпіризм і критика пізнання стали основою філософських дискусій.', detail:'Декарт шукав достовірну основу знання, а Кант досліджував умови можливості досвіду.', imageUrl:'/assets/modern.svg' },
    { slug:'contemporary', title:'Сучасна філософія', period:'XX — XXI століття', description:'Нові питання про мову, свідомість, свободу, технології, суспільство й ідентичність.', detail:'Аналітична та континентальна традиції пропонують різні методи й нові теми для діалогу.', imageUrl:'/assets/contemporary.svg' },
  ]
  const eraIds: Record<string, number | string> = {}
  for (const [index, e] of eras.entries()) eraIds[e.slug] = await ensure('epochs', { ...e, order: index + 1 })

  const thinkers = [
    {slug:'socrates',name:'Сократ',years:'бл. 469–399 до н. е.',idea:'Пізнання себе та сила запитань',bio:'Афінський філософ, що не залишив власних писемних творів. Його діалоги й підхід до пошуку істини відомі переважно через учнів, зокрема Платона.',epoch:'antiquity',imageUrl:'/assets/socrates.svg'},
    {slug:'plato',name:'Платон',years:'бл. 427–347 до н. е.',idea:'Світ форм та справедливий устрій',bio:'Учень Сократа, засновник Академії в Афінах. У діалогах досліджував знання, справедливість, душу й природу реальності.',epoch:'antiquity',imageUrl:'/assets/plato.svg'},
    {slug:'aristotle',name:'Арістотель',years:'384–322 до н. е.',idea:'Логіка, причини та чесноти',bio:'Учень Платона й засновник Лікею. Писав про логіку, природу, етику, політику та багато інших галузей знання.',epoch:'antiquity',imageUrl:'/assets/aristotle.svg'},
    {slug:'descartes',name:'Рене Декарт',years:'1596–1650',idea:'Методичний сумнів та мислення',bio:'Французький мислитель і математик. Прагнув знайти надійну основу знання через послідовне дослідження власних переконань.',epoch:'modern',imageUrl:'/assets/descartes.svg'},
    {slug:'kant',name:'Іммануїл Кант',years:'1724–1804',idea:'Межі пізнання та моральний обов’язок',bio:'Німецький філософ епохи Просвітництва. Досліджував, як людський розум формує досвід, а також принципи моральної дії.',epoch:'modern',imageUrl:'/assets/kant.svg'},
    {slug:'nietzsche',name:'Фрідріх Ніцше',years:'1844–1900',idea:'Переоцінка цінностей',bio:'Німецький філософ і філолог. Критикував усталені моральні системи та закликав переосмислювати джерела власних цінностей.',epoch:'modern',imageUrl:'/assets/nietzsche.svg'},
  ]
  const philosopherIds: Record<string, number | string> = {}
  for (const [index, item] of thinkers.entries()) {
    philosopherIds[item.slug] = await ensure('philosophers', { ...item, epoch: eraIds[item.epoch], order: index + 1 })
  }

  const sayings = [
    {slug:'socrates-idea',author:'Сократ',text:'Справжнє дослідження починається тоді, коли ми ставимо під сумнів власну впевненість.',philosopher:'socrates'},
    {slug:'plato-idea',author:'Платон',text:'Справедливість варто шукати і в душі людини, і в житті спільноти.',philosopher:'plato'},
    {slug:'aristotle-idea',author:'Арістотель',text:'Чесноти формуються через наші звички й усвідомлені вчинки.',philosopher:'aristotle'},
    {slug:'descartes-idea',author:'Рене Декарт',text:'Сумнів може допомогти знайти те, у чому ми маємо найбільше підстав бути впевненими.',philosopher:'descartes'},
    {slug:'kant-idea',author:'Іммануїл Кант',text:'Моральна дія потребує поваги до людини як до мети, а не лише засобу.',philosopher:'kant'},
    {slug:'nietzsche-idea',author:'Фрідріх Ніцше',text:'Варто розпитувати, звідки беруться наші цінності й чому ми їх приймаємо.',philosopher:'nietzsche'},
  ]
  for (const [index, item] of sayings.entries()) await ensure('quotes', {
    ...item, philosopher: philosopherIds[item.philosopher], order:index + 1,
    source: 'Переказ філософської позиції', isParaphrase: true,
  })

  const found = await payload.find({ collection:'pages', where:{ path:{ equals:'/' } }, limit:1, overrideAccess:true })
  if (!found.docs.length) {
    await payload.create({ collection:'pages', overrideAccess:true, data:{
      path:'/', title:'Філософія крізь віки', blocks:[
        {blockType:'hero',anchor:'home',badge:'МИСТЕЦТВО МИСЛИТИ',title:'Філософія крізь віки',subtitle:'Від античних мислителів до сучасних ідей. Досліджуйте історію людської думки та питання, які змінювали світ.',buttons:[{text:'Дослідити епохи',link:'#epochs',variant:'primary'},{text:'Видатні мислителі',link:'#philosophers',variant:'secondary'}]},
        {blockType:'about',anchor:'about',title:'Мистецтво ставити запитання',text:'Філософія не пропонує готову відповідь на кожне питання. Вона навчає мислити уважно, перевіряти аргументи та бачити світ із різних сторін.',topics:[
          {icon:'◇',title:'Логіка',text:'Як будувати обґрунтовані висновки та помічати помилки в міркуваннях.'},
          {icon:'✳',title:'Етика',text:'Що означає чинити правильно та як ми обираємо цінності.'},
          {icon:'◈',title:'Метафізика',text:'Що існує і якою є природа реальності.'},
          {icon:'◎',title:'Теорія пізнання',text:'Звідки береться знання і чому ми можемо довіряти.'},
        ]},
        {blockType:'epochs',anchor:'epochs',title:'Епохи великої думки',subtitle:'П’ять періодів, протягом яких змінювалося людське уявлення про світ.'},
        {blockType:'philosophers',anchor:'philosophers',title:'Ті, хто навчив нас думати',subtitle:'Познайомтеся з шістьма мислителями. Натисніть на картку, щоб прочитати більше.'},
        {blockType:'questions',anchor:'questions',title:'Питання без простих відповідей',items:[
          {question:'Що таке істина?',answer:'Одна з головних філософських суперечок: чи залежить істина від того, що існує незалежно від нас, чи від способу перевірки наших тверджень.'},
          {question:'Чи існує свобода волі?',answer:'Дехто вважає вибір вільним, коли ми діємо відповідно до своїх причин. Інші питають, чи можливий справжній вибір у світі причин і наслідків.'},
          {question:'У чому сенс життя?',answer:'Різні традиції бачать його у чесноті, пізнанні, турботі про інших або в сенсі, який людина створює сама.'},
          {question:'Що робить вчинок моральним?',answer:'Наслідки, наміри, обов’язок і риси характеру — різні етичні теорії надають цим чинникам різну вагу.'},
          {question:'Чи можемо ми пізнати світ таким, яким він є?',answer:'Наш досвід проходить через сприйняття й мислення. Філософія досліджує, що ми можемо знати, а що залишається поза межами досвіду.'},
        ]},
        {blockType:'quotes',anchor:'quotes',title:'Думки, що залишаються з нами',subtitle:'Вільні перекази ідей, а не неперевірені дослівні цитати.'},
        {blockType:'projectInfo',anchor:'project',title:'Про цей проєкт',text:'«Філософія крізь віки» — навчальний вебпроєкт, присвячений історії філософії. Матеріали створено для ознайомлення та заохочення до самостійного читання й роздумів.'},
      ],
    } as never })
  }
  // Якщо Global ще не заповнений, додаємо навігацію.
  // Відредаговані адміністратором значення при повторному запуску залишаються.
  const currentCommon = await payload.findGlobal({ slug: 'common', overrideAccess: true })
  if (!currentCommon.siteName || !currentCommon.menu?.length) {
    await payload.updateGlobal({ slug:'common', overrideAccess:true, data:{
      siteName:'Філософія крізь віки', logoText:'Філософія крізь віки',
      menu:[
        {label:'Головна',link:'#home'}, {label:'Про філософію',link:'#about'},
        {label:'Епохи',link:'#epochs'}, {label:'Мислителі',link:'#philosophers'},
        {label:'Філософські питання',link:'#questions'}, {label:'Цитати',link:'#quotes'},
        {label:'Про проєкт',link:'#project'},
      ],
      footer:{text:'Досліджуйте минуле. Ставте запитання сьогодні. Мисліть вільно.'},
    } })
  }
  payload.logger.info('Seed завершено: дані додано без дублювання; попередні зміни не перезаписано.')
  await payload.db.destroy?.()
}
seed().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
