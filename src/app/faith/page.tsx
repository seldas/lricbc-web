import React from 'react';

const FaithPage = () => {
  const sections = [
    {
      id: "intro",
      titleEn: "Introduction",
      titleZh: "一、圣经",
      contentEn: "The Holy Bible was written by men divinely inspired and is God's revelation of Himself to man. It is a perfect treasure of divine instruction. It has God for its author, salvation for its end, and truth, without any mixture of error, for its matter. Therefore, all Scripture is totally true and trustworthy. It reveals the principles by which God judges us, and therefore is, and will remain to the end of the world, the true center of Christian union, and the supreme standard by which all human conduct, creeds, and religious opinions should be tried. All Scripture is a testimony to Christ, who is Himself the focus of divine revelation.",
      contentZh: "圣经是由神所默示的人写成。圣经是神向人显明祂自己，是神的指示之完美宝藏，神是其作者。圣经旨在拯救世人，传达真理，其内容毫无错误。因此，所有经文都是完全真实可靠的。 圣经显明了神用来审判我们的准则，所以在现世以及直到世界的末了都是基督徒得以合一的真正核心。圣经也是判定人类一切行为、信条、宗教观念的最高准则。整本圣经都见证了基督，祂是神启示的焦点所在。"
    },
    {
      id: "god",
      titleEn: "II. God",
      titleZh: "二、神",
      contentEn: "There is one and only one living and true God. He is an intelligent, spiritual, and personal Being, the Creator, Redeemer, Preserver, and Ruler of the universe. God is infinite in holiness and all other perfections. God is all powerful and all knowing; and His perfect knowledge extends to all things, past, present, and future, including the future decisions of His free creatures. To Him we owe the highest love, reverence, and obedience. The eternal triune God reveals Himself to us as Father, Son, and Holy Spirit, with distinct personal attributes, but without division of nature, essence, or being.",
      contentZh: "有一位独一的又真又活的神。祂是智慧的、灵性的、有位格的存在，是万有的创造者、救赎者、维护者和统管者。神无限圣洁、完全完美、全能全知。祂拥有完美的认知，知道过去、现在、将来一切的事，包括那些有自由意志的受造物将来所做的决定。我们理当全然爱祂、尊崇祂、顺服祂。永存的三一神向我们显明祂的三一性，即父、子、圣灵各具不同的特点，但其本质、本性和本体却不可分割。"
    },
    {
      id: "man",
      titleEn: "III. Man",
      titleZh: "三、人",
      contentEn: "Man is the special creation of God, made in His own image. He created them male and female as the crowning work of His creation. The gift of gender is thus part of the goodness of God's creation. In the beginning man was innocent of sin and was endowed by his Creator with freedom of choice. By his free choice man sinned against God and brought sin into the human race. Through the temptation of Satan man transgressed the command of God, and fell from his original innocence whereby his posterity inherit a nature and an environment inclined toward sin. Therefore, as soon as they are capable of moral action, they become transgressors and are under condemnation. Only the grace of God can bring man into His holy fellowship and enable man to fulfill the creative purpose of God. The sacredness of human personality is evident in that God created man in His own image, and in that Christ died for man; therefore, every person of every race possesses full dignity and is worthy of respect and Christian love.",
      contentZh: "人是神独具匠心的创造，是照着神的形象造的。神造男造女，他们是祂创造的顶峰之作。男女性别是神赐予的，是神美好的创造。起初，人是无罪的。创造者赐给他自由，可以做出选择。然而，他自由做出的选择却使他犯罪得罪神，使罪进入全人类。撒旦试探引诱人，于是人违背了神的诫命，堕落败坏，不再无罪。他的后代也由此继承了倾向于犯罪的本性和生活环境。因此，只要他们能够做出道德上的决定，他们就会犯罪并被定罪。只有神的恩典能使人与这位圣洁的神建立关系，能让人成就神造人的旨意。人的神圣是显而易见的，这是因为神照着神的形象造人并且基督为人死；因此，每个种族的每个人都完全有人的尊严，配得受到尊重和得到来自基督徒的爱。"
    },
    {
      id: "salvation",
      titleEn: "IV. Salvation",
      titleZh: "四、救恩",
      contentEn: "Salvation involves the redemption of the whole man, and is offered freely to all who accept Jesus Christ as Lord and Saviour, who by His own blood obtained eternal redemption for the believer. In its broadest sense salvation includes regeneration, justification, sanctification, and glorification. There is no salvation apart from personal faith in Jesus Christ as Lord.",
      contentZh: "救恩涉及对全人的救赎， 是白白赐给所有接受耶稣基督为主和救主之人的。耶稣基督用祂的宝血永远救赎了信徒。从广义来说，救恩包括重生、称义、成圣和得荣耀。除非个人信靠耶稣基督，接受祂为主，否则不能得到救恩。"
    },
    {
        id: "grace",
        titleEn: "V. God's Purpose of Grace",
        titleZh: "五、神恩典的旨意",
        contentEn: "Election is the gracious purpose of God, according to which He regenerates, justifies, sanctifies, and glorifies sinners. It is consistent with the free agency of man, and comprehends all the means in connection with the end. It is the glorious display of God's sovereign goodness, and is infinitely wise, holy, and unchangeable. It excludes boasting and promotes humility. All true believers endure to the end. Those whom God has accepted in Christ, and sanctified by His Spirit, will never fall away from the state of grace, but shall persevere to the end.",
        contentZh: "拣选是神恩典的旨意，神依照其旨意使罪人重生、称义、成圣和得荣耀。这与人的自由意志并不矛盾， 并且涵盖了为达成这一目标的所有方式。神的拣选荣耀地彰显了神主权的良善，是完全智慧的、圣洁的、不可改变的，使人无法自夸，让人谦卑下来。 所有真正的信徒都会忍耐到最后。那些在基督里神所接受并通过圣灵使其成圣的人绝不会从恩典中坠落，而会忍耐到底。"
    },
    {
        id: "church",
        titleEn: "VI. The Church",
        titleZh: "六、教会",
        contentEn: "A New Testament church of the Lord Jesus Christ is an autonomous local congregation of baptized believers, associated by covenant in the faith and fellowship of the gospel; observing the two ordinances of Christ, governed by His laws, exercising the gifts, rights, and privileges invested in them by His Word, and seeking to extend the gospel to the ends of the earth. Each congregation operates under the Lordship of Christ through democratic processes. In such a congregation each member is responsible and accountable to Christ as Lord. Its scriptural officers are pastors and deacons. While both men and women are gifted for service in the church, the office of pastor is limited to men as qualified by Scripture. The New Testament speaks also of the church as the Body of Christ which includes all of the redeemed of all the ages, believers from every tribe, and tongue, and people, and nation.",
        contentZh: "新约模式的耶稣基督的教会是一群受浸了的信徒的集合。这一集合是自主的，地方性的，是在福音带来的基督教信仰和团契上通过约联接起来。教会遵行基督设立的两个礼仪，依照基督的律治理会众。信徒行使借着神话语领受到的恩赐、权利和特权，力图传扬福音，直到地极。每个教会在基督的权柄下依照民主程序运作。在这样的会众中，每个成员都有责任以基督为主。圣经提到教会里的职分有牧师和执事。尽管弟兄和姐妹都领受了恩赐，用于教会里的事奉；但是，牧师这一职分只限于符合圣经规定资格的弟兄担当。新约也谈到教会是基督的身体，其成员包括历代被赎之民，包括各国、各族、各民、各方的人。"
    },
    {
        id: "baptism",
        titleEn: "VII. Baptism and the Lord's Supper",
        titleZh: "七、浸礼和主餐",
        contentEn: "Christian baptism is the immersion of a believer in water in the name of the Father, the Son, and the Holy Spirit. It is an act of obedience symbolizing the believer's faith in a crucified, buried, and risen Saviour, the believer's death to sin, the burial of the old life, and the resurrection to walk in newness of life in Christ Jesus. It is a testimony to his faith in the final resurrection of the dead. Being a church ordinance, it is prerequisite to the privileges of church membership and to the Lord's Supper. The Lord's Supper is a symbolic act of obedience whereby members of the church, through partaking of the bread and the fruit of the vine, memorialize the death of the Redeemer and anticipate His second coming.",
        contentZh: "基督徒的浸礼是奉父、子、圣灵的名使信徒全身浸入水中的仪式。这是顺服的行动，象征着信徒信靠这位被钉十架、被埋葬、从死里复活的救主，象征着信徒向罪死、旧的生命被埋葬、在基督耶稣里复活、活出基督里的新生命。浸礼也是受浸之人的见证，见证了他相信将来末世会有死里复活。浸礼是教会的一个礼仪，是获得教会会友资格和被允许领主餐的先决条件。主餐是一个象征，也是信徒顺服的行动。教会成员顺服基督的吩咐，通过领受饼和杯纪念救赎主的受死和期盼等待祂再来。"
    },
    {
        id: "family",
        titleEn: "XVIII. The Family",
        titleZh: "十八、家庭",
        contentEn: "God has ordained the family as the foundational institution of human society. It is composed of persons related to one another by marriage, blood, or adoption. Marriage is the uniting of one man and one woman in covenant commitment for a lifetime. It is God's unique gift to reveal the union between Christ and His church and to provide for the man and the woman in marriage the framework for intimate companionship, the channel of sexual expression according to biblical standards, and the means for procreation of the human race. The husband and wife are of equal worth before God, since both are created in God's image. The marriage relationship models the way God relates to His people. A husband is to love his wife as Christ loved the church. He has the God-given responsibility to provide for, to protect, and to lead his family. A wife is to submit herself graciously to the servant leadership of her husband even as the church willingly submits to the headship of Christ. She, being in the image of God as is her husband and thus equal to him, has the God-given responsibility to respect her husband and to serve as his helper in managing the household and nurturing the next generation. Children, from the moment of conception, are a blessing and heritage from the Lord. Parents are to demonstrate to their children God's pattern for marriage. Parents are to teach their children spiritual and moral values and to lead them, through consistent lifestyle example and loving discipline, to make choices based on biblical truth. Children are to honor and obey their parents.",
        contentZh: "神设立了家庭这个人类社会最基本的组成单位。通过婚姻、血缘关系、领养，人们组成家庭。 婚姻是一男一女的结合，是双方一生委身于这个约。婚姻是神赐下的独特的礼物，体现了基督和祂的教会的联合；在婚姻这个范围内，男女建立亲密的伴侣关系，依照圣经的准则表达性爱和繁衍后代。 丈夫和妻子在神面前具有同等的价值，因为二者都是照着神的形象造的。婚姻关系反映了神如何与祂子民相交。丈夫要爱妻子，如同基督爱教会。神赋予丈夫供养、保护和带领家庭的责任。妻子要甘心乐意地顺服丈夫仆人样式的带领，如同教会甘愿顺服基督的带领。如同丈夫具有神的形象一样，妻子也具有神的形象，与丈夫是同等的。神赋予妻子尊敬丈夫、帮助丈夫的责任，帮助他管理家庭、养育下一代。 儿女从受孕的那一刻开始就是从神而来的福分和产业。父母在儿女面前要展示出神设立的婚姻样式。父母要教导儿女属灵上的和道德上的价值观，在生活上有表里如一、前后一致的榜样，对儿女要有爱心地管教，以此来带领他们依照圣经中的真理做决定。儿女要尊荣和听从父母。"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="mb-10 text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Baptist Faith and Message 2000</h1>
        <h2 className="text-2xl font-semibold text-gray-700">2000浸信会信仰与信息</h2>
        <p className="mt-4 text-sm text-gray-500 italic">
          Reference: Derived from the Southern Baptist Convention (SBC) and NWBC Houston bilingual resources.
        </p>
      </header>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.id} className="grid md:grid-cols-2 gap-8 border-b pb-8 last:border-0">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">{section.titleEn}</h3>
              <p className="text-gray-700 leading-relaxed">{section.contentEn}</p>
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-md">
              <h3 className="text-xl font-bold text-gray-800">{section.titleZh}</h3>
              <p className="text-gray-700 leading-relaxed">{section.contentZh}</p>
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
        <p>© 2000 Southern Baptist Convention. Translated for educational and ministry purposes.</p>
        <p className="mt-2">
            Sources: 
            <a href="https://www.nwcbchouston.org/2000baptist" className="text-blue-600 hover:underline mx-2">NWBC English</a> | 
            <a href="https://www.nwcbchouston.org/copy-of-2000%E6%B5%B8%E4%BF%A1%E4%BC%9A%E4%BF%A1%E4%BB%B0%E4%B8%8E%E4%BF%A1%E6%81%AF" className="text-blue-600 hover:underline mx-2">NWBC Chinese</a>
        </p>
      </footer>
    </div>
  );
};

export default FaithPage;
