
import {EnumerateURLList} from './components/EnumerateURLList.js'

import {MigratePageContent} from './components/MigratePageContent.js'

async function Controller (){
    var targetDomain = 'https://www.forrestjacksonlaw.com/'
    var targetSitemap = 'https://www.forrestjacksonlaw.com/sitemap.xml'
   // var URLList = await EnumerateURLList(targetDomain,targetSitemap) ///Enumerates all intenral urls linked from homepage and sitemap
  var URLList = [
    'https://www.forrestjacksonlaw.com/about-us/meet-our-founder/',
]  
   var MigrateResult = await MigratePageContent(targetDomain,URLList)
    console.log(MigrateResult)
}
Controller()