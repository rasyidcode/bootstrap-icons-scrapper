import puppeteer from "puppeteer";
import fs from "fs";

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto("https://icons.getbootstrap.com/");
await page.setViewport({ width: 1080, height: 1024 });

const iconListSelector = await page.locator("#icons-list").waitHandle();
const iconList = await iconListSelector?.evaluate((el) => {
  const container = document.createElement("div");
  container.innerHTML = el.outerHTML;
  const items = container.firstElementChild.querySelectorAll("li");
  const data = [];
  items.forEach((item, index) => {
    data.push({
      id: `bi-${index + 1}`,
      name: item.getAttribute("data-name"),
    });
  });
  return data;
});

await browser.close();

const iconsJsonStr = JSON.stringify(iconList, null, 2);

fs.writeFile("bi-icons.json", iconsJsonStr, (err) => {
  if (err) {
    console.error("Errror writing file: ", err);
  } else {
    console.log("JSON data saved to bi-icons.json");
  }
});
