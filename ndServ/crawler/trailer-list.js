const puppeteer = require('puppeteer')
const fs=require('fs')
const url = 'https://movie.douban.com/explore#!type=movie&sort=recommend&page_limit=20&page_start=0'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

console.log('运行中...');

 ;(async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      dumpio: false
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2'
    });
    await sleep(3000)

    await page.waitForSelector('.more')

    for (let i = 0; i < 3; i++) {
      await sleep(3000)
      await page.click('.more')
    }

    const result = await page.evaluate(() => {
      var $ = window.$
      var items = $('.list-wp a')
      var links = []

      if (items.length >= 1) {
        items.each((index, item) => {
          let it = $(item);
          let doubanId = it.find('div').data('id');
          let title =  it.find('img').attr('alt');
          let rate = Number(it.find('strong').text());
          let poster = it.find('img').attr('src');
          if(poster){
            poster=poster.replace('s_ratio','l_ratio')
          }
          links.push({
            doubanId,
            title,
            rate,
            poster
          })
        })
      }
      return links
    })

    // console.log(result)

    await browser.close();

    process.send({result})
    process.exit(0)

  })();

  

  