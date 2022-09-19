const sourceDom = document.getElementById("source_url");
const targetDom = document.getElementById("target_url");

function include(obj, arr) {
  const newObj = {};
  arr.forEach((item) => {
    newObj[item] = obj[item] || "";
  });
  return newObj;
}

function isValidHttp(src = "") {
  if (src.startsWith("https://") || src.startsWith("http://")) {
    return true;
  }
  return false;
}

document.getElementById("confirm").addEventListener("click", () => {
  const target_url = targetDom.value;
  const source_url = sourceDom.value;

  if (!isValidHttp(source_url)) {
    return alert("获取的链接不合法");
  }
  if (!isValidHttp(target_url)) {
    return alert("写入的目标链接不合法。。。");
  }

  chrome.cookies.getAll(
    {
      url: source_url,
    },
    (cookiesList) => {
      cookiesList
        .map((cookies) =>
          include(cookies, [
            "httpOnly",
            "name",
            "path",
            "sameSite",
            "secure",
            "storeId",
            "value",
          ])
        )
        .forEach((cookies, index) => {
          chrome.cookies.set(
            {
              ...cookies,
              httpOnly: Boolean(cookies.httpOnly),
              secure: Boolean(cookies.secure),
              url: target_url,
            },
            () => {
              if (index === cookiesList.length - 1) {
                alert("写入成功");
              }
            }
          );
        });
    }
  );
});
