// Aperçus du catalogue des modules : image fixe (1re image du GIF) par défaut, GIF animé au survol uniquement,
// pour qu'une page de plusieurs dizaines de cartes ne s'anime pas tout entière.
// L'image fixe est capturée dans un canvas : l'attribut crossorigin de l'image (posé par collect_modules.py) l'autorise.
(function () {
  function freeze(img) {
    if (img.dataset.gif) { return; }   // load relancé par le passage à l'image fixe
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d").drawImage(img, 0, 0);
    img.dataset.gif = img.src;
    img.dataset.still = canvas.toDataURL();
    img.src = img.dataset.still;
    img.addEventListener("mouseenter", function () { img.src = img.dataset.gif; });
    img.addEventListener("mouseleave", function () { img.src = img.dataset.still; });
  }

  function freezeAll() {
    document.querySelectorAll("img.module-preview").forEach(function (img) {
      if (img.complete && img.naturalWidth) {
        freeze(img);
      } else {
        img.addEventListener("load", function () { freeze(img); }, { once: true });
      }
    });
  }

  // « document$ » est publié par le thème à chaque page, y compris avec la navigation instantanée
  if (typeof document$ !== "undefined") {
    document$.subscribe(freezeAll);
  } else {
    document.addEventListener("DOMContentLoaded", freezeAll);
  }
})();
