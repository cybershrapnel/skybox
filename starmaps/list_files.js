(function () {
  console.log("[MEQ] Scanning page for .txt links…");

  var items = document.querySelectorAll("li.Box-row");
  var results = [];

  for (var i = 0; i < items.length; i++) {
    var li = items[i];

    // Find the link ending in .txt
    var link = li.querySelector('a[href$=".txt"]');
    if (!link) continue;

    var href = link.getAttribute("href");
    if (!href) continue;

    // Build absolute URL
    var url;
    try {
      url = new URL(href, window.location.origin).toString();
    } catch (e) {
      console.warn("[MEQ] Skipping malformed href:", href, e);
      continue;
    }

    // Filename (from link text)
    var nameSpan = link.querySelector(".Truncate-text.text-bold");
    var filename = (nameSpan ? nameSpan.textContent : link.textContent || href).trim();

    // SHA256 digest (if present)
    // This is inside the text-mono span in your snippet
    var shaSpan = li.querySelector("span.text-mono .Truncate-text");
    var sha256 = shaSpan ? shaSpan.textContent.trim() : null;

    // File size: first "color-fg-muted text-right" span is the size in your layout
    var sizeSpans = li.querySelectorAll("span.color-fg-muted.text-right");
    var sizeText = sizeSpans.length > 0 ? sizeSpans[0].textContent.trim() : null;

    results.push({
      filename: filename,
      url: url,
      size: sizeText,
      sha256: sha256
    });
  }

  console.log("[MEQ] Found .txt files:", results.length);
  console.table(results);

  // Download as JSON file
  var blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
  var urlBlob = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = urlBlob;
  a.download = "starmaps-list.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(urlBlob);

  console.log("[MEQ] Downloaded starmaps-list.json");
})();
