const chromium = require('chrome-aws-lambda');

const AWS = require('aws-sdk');

require('dotenv').config();

exports.handler = async () => {
  const filteredApartmentsUrl = process.env.PAGE_ROOMS_4;

  try {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(filteredApartmentsUrl);

    const apartments = await page.evaluate(() => {
      let items = Array.from(
        document.querySelectorAll(
          '.catalog-content__container > .catalog-item',
        ),
      );

      return items
        .map((item) => item.innerText)
        .filter((apartment) => apartment.indexOf('7.43') === -1);
    });

    console.log('apartments', apartments);

    const sns = new AWS.SNS({
      region: 'eu-north-1',
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.ACCESS_SECRET,
    });

    if (apartments.length > 0) {
      await sns
        .publish({
          Message: `Появились новые 4-комнатные квартиры. Проверь адрес: ${filteredApartmentsUrl}`,
          TopicArn: 'arn:aws:sns:eu-north-1:409948879486:newBorNew4RoomAparts',
          Subject: '4-комнатные квартиры в Новой Боровой',
        })
        .promise();
    } else {
      await sns
        .publish({
          Message: 'Пока ждём...',
          TopicArn: 'arn:aws:sns:eu-north-1:409948879486:newBorNew4RoomAparts',
          Subject: 'Новых "четырёшек" в Новой Боровой пока нет',
        })
        .promise();
    }

    await browser.close();
  } catch (e) {
    console.error(e);

    process.exit(1);
  }
};
