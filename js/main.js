var init = function () {
    // var closeBtns = document.querySelectorAll(".options .close-button");
    // for (var i = 0; i < closeBtns.length; i++) {
    //     closeBtns[i].onclick = function () {
    //         this.parentElement.style.display = 'none';
    //     }
    // }


    var tabButtons = document.querySelectorAll('.menu-control');
    var tabContents = document.querySelectorAll('.options');
    tabButtons.forEach(function (item) {
        item.addEventListener('click', function () {
            removeActiveTabButton();
            closeAllTabContents();
            this.classList.toggle('active');
            var thisTabContent = document.querySelector("#" + this.id + "-content");
            thisTabContent.classList.add("active");
        })
    })

    function removeActiveTabButton() {
        tabButtons.forEach(function (item) {
            item.classList.remove('active');
        })
    }
    function closeAllTabContents() {
        tabContents.forEach(function (item) {
            item.classList.remove('active');
        })
    }

}

var textarea = document.querySelector('.input-text');

textarea.addEventListener('keydown', autosize);

function autosize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 0);
}

document.addEventListener("DOMContentLoaded", init, false);