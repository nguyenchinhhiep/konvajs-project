var canvasPadding = 50 * 2;
var canvasWidth = window.innerWidth - 430 - canvasPadding;
var canvasHeight = window.innerHeight - 45 - canvasPadding;

var currentShape = this;

var bgItem,
  srcImg,
  bgImg,
  background,
  textOptions,
  textColor,
  textFontSize,
  textFontFamily,
  textDec;
textOptions = document.querySelector(".field-text-option");
textColor = document.querySelector("#text-color");
textFontSize = document.querySelector("#font-size-text");
textFontFamily = document.querySelector("#font-family-text");
textDec = document.querySelectorAll(".text-dec");

// Create Background
bgImg = new Image();
bgImg.onload = function() {
  var map = new Konva.Image({
    x: 0,
    y: 0,
    image: bgImg,
    name: "bg-image",
    width: stage.width(),
    height: stage.height()
  });

  layer.add(map);
  layer.batchDraw();
  stage.add(layer);
  map.moveToBottom();
};

// Create Image

// Add Image
var imgItem = document.querySelectorAll(".image-item img");
imgItem.forEach(item => {
  item.onclick = function(e) {
    var canvasImg = new Image();
    canvasImg.onload = function() {
      var imgSrc = new Konva.Image({
        x: 0,
        y: 0,
        image: canvasImg,
        draggable: true,
        name: "canvas-image"
      });
      layer.add(imgSrc);
      stage.add(layer);
      layer.batchDraw();
    };
    var imgItemSrc = this.getAttribute("src");
    canvasImg.src = imgItemSrc;
  };
});
// Change Background
bgItem = document.querySelectorAll(".bg-item img");
bgItem.forEach(item => {
  item.onclick = function(e) {
    stage.find(".bg-image").destroy();
    srcImg = this.getAttribute("src");
    bgImg.src = srcImg;
  };
});

// Upload Image
var uploadImgBtn = document.querySelector("#upload-img");
uploadImgBtn.onchange = function() {
  uploadImage(this);
};

function uploadImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var canvasImg = new Image();
      canvasImg.onload = function() {
        var imgSrc = new Konva.Image({
          x: 0,
          y: 0,
          image: canvasImg,
          draggable: true,
          name: "canvas-image"
        });
        layer.add(imgSrc);

        stage.add(layer);
        layer.batchDraw();
      };

      canvasImg.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}
// Upload Background
var uploadBtn = document.querySelector("#upload-bg");
uploadBtn.onchange = function() {
  readURL(this);
};
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      stage.find(".bg-image").destroy();
      bgImg.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function writeMessage(message) {
  text.text(message);
  layer.draw();
}

var stage = new Konva.Stage({
  container: "canvas-container",
  width: 544,
  height: 704
});

var layer = new Konva.Layer({
  zIndex: 1
});

stage.add(layer);

document.querySelector(".add-text").addEventListener(
  "click",
  function() {
    var text = document.querySelector(".input-text").value;
    if (!text.trim()) {
      text = "Sample text";
    }

    var newText = new Konva.Text({
      x: 130,
      y: 200,
      text: text,
      fontSize: 20,
      fontFamily: "Open Sans",
      fill: "#004080",
      name: "text",
      lineHeight: 1.2,
      draggable: true
    });

    layer.add(newText);

    //remove all transformer before create new
    stage.find("Transformer").destroy();

    // create new transformer
    var tr = new Konva.Transformer({
      node: newText,
      enabledAnchors: ["middle-left", "middle-right"],
      // set minimum width of text
      boundBoxFunc: function(oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      }
    });
    newText.on("transform", function() {
      // reset scale, so only with is changing by transformer
      newText.setAttrs({
        width: newText.width() * newText.scaleX(),
        scaleX: 1
      });
    });
    layer.add(tr);
    tr.attachTo(newText);
    layer.draw();
    text = "";
    document.getElementById("textarea-custom").value = "";
  },
  false
);

stage.on("click", function(e) {

  // if click on empty area - remove all transformers
  if (e.target === stage) {
    stage.find("Transformer").destroy();
    textOptions.style.display = "none";
    // closeTextAreas();
    layer.draw();
    return;
  }
  if (e.target.hasName("bg-image")) {
    stage.find("Transformer").destroy();
    // closeTextAreas();
    textOptions.style.display = "none";
    layer.draw();
  }


  
  if (e.target.hasName("text")) {
    var currentText = e.target;
    textOptions.style.display = "none";

    currentText.addEventListener("dblclick", function(e) {
      currentText.hide();
      tr.hide();
      layer.draw();
      closeTextAreas();
      // create textarea over canvas with absolute position

      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      var textPosition = currentText.getAbsolutePosition();

      // then lets find position of stage container on the page:
      var stageBox = stage.container().getBoundingClientRect();

      // so position of textarea will be the sum of positions above:
      var areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y
      };
      
      // Change text color
      textColor.value = currentText.fill();
      textColor.onchange = function() {
        currentText.fill(textColor.value);
        layer.draw();
      };
      // Change Font Size Text
      textFontSize.value = currentText.fontSize();
      textFontSize.onchange = function() {
        currentText.fontSize(+textFontSize.value);
        layer.draw();
      };

      // Change Font Family Text
      textFontFamily.value = currentText.fontFamily();
      textFontFamily.onchange = function() {
        currentText.fontFamily(textFontFamily.value);
        layer.draw();
      };

      // Change text Decoration
      let isBold,
        isItalic,
        isUnderline,
        isLineThrough = false;
      textDec.forEach(item => {
        item.onclick = function(e) {
          var data = item.getAttribute("data-dec");
          switch (data) {
            case "bold":
              if (!isBold) {
                currentText.fontStyle("bold");
                layer.draw();
                isBold = true;
                break;
              } else {
                currentText.fontStyle("");
                layer.draw();
                isBold = false;
                break;
              }

            case "italic":
              if (!isItalic) {
                currentText.fontStyle("italic");
                layer.draw();
                isItalic = true;
                break;
              } else {
                currentText.fontStyle("");
                layer.draw();
                isItalic = false;
                break;
              }

            case "underline":
              if (!isUnderline) {
                currentText.textDecoration("underline");
                layer.draw();
                isUnderline = true;
                break;
              } else {
                currentText.textDecoration("");
                layer.draw();
                isUnderline = false;
                break;
              }

            case "line-through":
              if (!isLineThrough) {
                currentText.textDecoration("line-through");
                layer.draw();
                isLineThrough = true;
                break;
              } else {
                currentText.textDecoration("");
                layer.draw();
                isLineThrough = false;
                break;
              }
          }
        };
      });

      // create textarea and style it
      var textarea = document.createElement("textarea");
      textarea.setAttribute("class", "textarea-edit");
      document.body.appendChild(textarea);

      textarea.value = currentText.text();
      textarea.style.position = "absolute";
      textarea.style.top = areaPosition.y + 6 + "px";
      textarea.style.left = areaPosition.x + 6 + "px";
      // textarea.style.width = 544 +'px';
      // textarea.style.height = 75 +'px';

      // textarea.focus();

      // textarea.addEventListener('input', function (e) {
      //     currentText.text(textarea.value);
      //     layer.draw();
      // hide on enter
      // });
      textarea.style.width =
        currentText.width() - currentText.padding() * 2 + 10 +  "px";
      textarea.style.height =
        currentText.height() - currentText.padding() * 2 + "px";
        // Display text options
      textOptions.style.top = areaPosition.y + textarea.clientHeight + 25 + "px";
      textOptions.style.left = stageBox.left + 6 + "px";
      textOptions.style.display = "block";

      textarea.style.fontSize = currentText.fontSize() + "px";
      textarea.style.border = "none";
      textarea.style.padding = "0px";
      textarea.style.margin = "0px";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      textarea.style.lineHeight = currentText.lineHeight();
      textarea.style.fontFamily = currentText.fontFamily();
      textarea.style.transformOrigin = "left top";
      textarea.style.textAlign = currentText.align();
      textarea.style.color = currentText.fill();
      rotation = currentText.rotation();
      var transform = "";
      if (rotation) {
        transform += "rotateZ(" + rotation + "deg)";
      }
      var px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        px += 2 + Math.round(currentText.fontSize() / 20);
      }
      transform += "translateY(-" + px + "px)";

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = "auto";
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + "px";

      textarea.focus();

      function removeTextarea() {
        closeTextAreas();
        window.removeEventListener("click", handleOutsideClick);
        currentText.show();
        tr.show();
        // tr.forceUpdate();
        layer.draw();
      }

      function setTextareaWidth(newWidth) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = currentText.placeholder.length * currentText.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth + "px";
      }

      textarea.addEventListener("keydown", function(e) {
        // hide on enter
        // but don't hide on shift + enter
        // if (e.keyCode === 13 && !e.shiftKey) {
        //   currentText.text(textarea.value);
        //   removeTextarea();
        // }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });

      textarea.addEventListener("keydown", function(e) {
        scale = currentText.getAbsoluteScale().x;
        setTextareaWidth(currentText.width() * scale);
        textarea.style.height = "auto";
        textarea.style.height =
          textarea.scrollHeight + currentText.fontSize() + "px";
      });

      function handleOutsideClick(e) {
        if (e.target.type != 'textarea') {
          currentText.text(textarea.value);
          removeTextarea();
        }
        
      }
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
    });
  }

  // create new transformer
  if (!e.target.hasName("bg-image") && !e.target.hasName("text")) {
    stage.find("Transformer").destroy();

    var tr = new Konva.Transformer();
    layer.add(tr);
    tr.attachTo(e.target);
    layer.draw();
  }

  if (e.target.hasName("text")) {
    stage.find("Transformer").destroy();

    var tr = new Konva.Transformer({
      node: e.target,
      enabledAnchors: ["middle-left", "middle-right"],
      // set minimum width of text
      boundBoxFunc: function(oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      }
    });
    e.target.on("transform", function() {
      // reset scale, so only with is changing by transformer
      e.target.setAttrs({
        width: e.target.width() * e.target.scaleX(),
        scaleX: 1
      });
    });
    layer.add(tr);
    tr.attachTo(e.target);
    layer.draw();
  }
});

// setup menu
var menuNode = document.getElementById("context-menu");
document.getElementById("delete-button").addEventListener("click", function() {
  currentShape.destroy();
  layer.draw();
});

window.addEventListener("click", function(e) {
  e.stopPropagation();
  // hide menu
  menuNode.style.display = "none";
  
});

stage.on("contextmenu", function(e) {
  // prevent default behavior
  e.evt.preventDefault();
  if (e.target === stage) {
    // if we are on empty place of the stage we will do nothing
    return;
  }
  stage.find("Transformer").destroy();
  // show menu
  menuNode.style.display = "initial";
  var containerRect = stage.container().getBoundingClientRect();
  menuNode.style.top =
    containerRect.top + stage.getPointerPosition().y + 30 + "px";
  menuNode.style.left =
    containerRect.left + stage.getPointerPosition().x + 30 + "px";
});

function closeTextAreas() {
  var textareas = document.querySelectorAll(".textarea-edit");
  if (textareas) {
    for (var i = 0; i < textareas.length; i++) {
      document.body.removeChild(textareas[i]);
    }
  }
}
// Export Canvas
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

document.getElementById("save").addEventListener(
  "click",
  function() {
    var dataURL = stage.toDataURL({ pixelRatio: 3 });
    downloadURI(dataURL, "stage.png");
    console.log(stage.toJSON());
  },
  false
);
// Template
const templates = [
  {
    textData: [
      {
        text: "HOME FOR SALE",
        fontSize: 42,
        fontFamily: "Josefin Sans",
        color: "#ffffff",
        x: 167,
        y: 37
      },
      {
        text: "PROTERTY",
        fontSize: 16,
        fontFamily: "Josefin Sans",
        color: "#000000",
        x: 12,
        y: 444
      },
      {
        text: "FEATURES",
        fontSize: 16,
        fontFamily: "Josefin Sans",
        color: "#317ee1",
        x: 98,
        y: 444
      },
      {
        text: "OVERVIEW",
        fontSize: 16,
        fontFamily: "Josefin Sans",
        color: "#000000",
        x: 277,
        y: 444
      },
      {
        text:
          "Praesent sapien massa, convallis a pellentesque nec,\negestas non nisi. Proin eget tortor risus. Quisque velit nisi,\npretium ut lacinia in, elementum id enim.",
        fontSize: 10,
        fontFamily: "Lato",
        color: "#000000",
        x: 30,
        y: 472
      },
      {
        text:
          "Praesent sapien massa, convallis a pellentesque nec,\negestas non nisi. Proin eget tortor risus. Quisque velit nisi,\npretium ut lacinia in, elementum id enim.",
        fontSize: 10,
        fontFamily: "Lato",
        color: "#000000",
        x: 295,
        y: 472
      },
      {
        text:
          "Praesent sapien massa, convallis a pellentesque nec,\negestas non nisi. Proin eget tortor risus. Quisque velit nisi,\npretium ut lacinia in, elementum id enim.",
        fontSize: 10,
        fontFamily: "Lato",
        color: "#000000",
        x: 30,
        y: 514
      },
      {
        text:
          "Praesent sapien massa, convallis a pellentesque nec,\negestas non nisi. Proin eget tortor risus. Quisque velit nisi,\npretium ut lacinia in, elementum id enim.",
        fontSize: 10,
        fontFamily: "Lato",
        color: "#000000",
        x: 296,
        y: 514
      },
      {
        text: "CONTACT US: (098)4654-513",
        fontSize: 32,
        fontFamily: "League Gothic",
        color: "#ffffff",
        x: 66,
        y: 665
      }
    ],
    imgsData: [],
    bgUrl: "images/templates/design-2.png"
  },
  {
    textData: [
      {
        text: "FOR\nSALE",
        fontSize: 64,
        fontFamily: "Anton",
        color: "#ffffff",
        x: 329,
        y: 215
      },
      {
        text: "ORDER AT",
        fontSize: 14,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 339,
        y: 359
      },
      {
        text: "10,000,000",
        fontSize: 30,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 339,
        y: 382
      },
      {
        text: "THIS HOME IS FUTURE...",
        fontSize: 18,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 26,
        y: 340
      },
      {
        text: "2 Living rooms",
        fontSize: 14,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 44,
        y: 383
      },
      {
        text: "1 Dining room",
        fontSize: 14,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 42,
        y: 405
      },
      {
        text: "3 Bedrooms",
        fontSize: 14,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 184,
        y: 382
      },
      {
        text: "Bathrooms",
        fontSize: 14,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 185,
        y: 405
      },
      {
        text:
          "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Proin eget tortor risus",
        fontSize: 12,
        fontFamily: "Open Sans",
        color: "#000000",
        x: 64,
        y: 590
      },
      {
        text:
          "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi",
        fontSize: 12,
        fontFamily: "Open Sans",
        color: "#000000",
        x: 105,
        y: 608
      },
      {
        text: "CONTACT US: (984)654-513",
        fontSize: 16,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 105,
        y: 654
      },
      {
        text: "realestate@gmail.com | www.realestate.com",
        fontSize: 10,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 331,
        y: 648
      },
      {
        text: "2112 Isabella Ave, Burlington, IA, 52601",
        fontSize: 10,
        fontFamily: "Open Sans",
        color: "#ffffff",
        x: 334,
        y: 666
      }
    ],
    imgsData: [],
    bgUrl: "images/templates/design-1.png"
  }
];
function createText(options) {
  for (var i = 0; i < options.textData.length; i++) {
    var newText = new Konva.Text({
      x: options.textData[i].x,
      y: options.textData[i].y,
      text: options.textData[i].text,
      fontSize: options.textData[i].fontSize,
      fontFamily: options.textData[i].fontFamily,
      fill: options.textData[i].color,
      name: "text",
      lineHeight: 1.2,
      draggable: true,
      rotation: options.textData[i].rotation
    });

    layer.add(newText);
  }

  //remove all transformer before create new
  stage.find("Transformer").destroy();
  layer.draw();

}
function createBg(options) {
  stage.find(".bg-image").destroy();
  bgImg.src = options.bgUrl;
}
function createImage(options) {
  const array = options.imgsData;
  array.forEach(function(item) {
    var newImage = new Image();
    newImage.onload = function() {
      let newImgSrc = new Konva.Image({
        x: item.x,
        y: item.y,
        image: newImage,
        draggable: true,
        name: "canvas-image",
        scaleX: item.scaleX,
        scaleY: item.scaleY
      });
      layer.add(newImgSrc);
      layer.batchDraw();
    };
    newImage.src = item.src;
  });
}

const templateItem = document.querySelectorAll(".template-item");
templateItem.forEach((item, index) => {
  item.addEventListener(
    "click",
    function(e) {
      stage.find("Text").destroy();
      stage.find("Image").destroy();
      createBg(templates[index]);
      createText(templates[index]);
      createImage(templates[index]);
    },
    false
  );
});
