

// 2. Define drawImageData()
function drawImageData(image, canvas) {
    image.height *= canvas.offsetWidth / image.width;
    image.width = canvas.offsetWidth;

    if(image.height > canvas.offsetHeight){
        image.width *= canvas.offsetHeight / image.height;
        image.height = canvas.offsetHeight;
    }

    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    // console.log(ctx.getImageData(0,0, canvas.width, canvas.height));
}


// 3. Define event handler func: click input button
function eventInputBtn(e, canvas) {
    // e : Event 객체 "change"
    //      event handler 함수의 argument는 default 로 Event 객체가 온다.

    // e.target : A reference to the target to which the event was originally dispatched.
    //      event가 발생한 document 객체에 대한 참조.
    var file = e.target.files[0];

    var fileReader = new FileReader();

    console.log(e);

    // load 이벤트의 핸들러.
    //      이 이벤트는 읽기 동작이 성공적으로 완료 되었을 때마다 발생합니다.
    fileReader.onload = function (e) {
        // e : Event 객체 "load"
        var image = new Image();

        // e.target.result : 파일의 내용 (소스)
        image.src = e.target.result;
        console.log(e);

        // load 이벤트의 핸들러 : image객체의 로드가 끝나면 draw
        image.onload = function () {
            drawImageData(image, canvas);
        }
    };

    fileReader.readAsDataURL(file);
}


// 4. Define event handler func: click filter button
function eventFilterBtn(e, canvas1, canvas2, combCanvas) {

    function filter(pixels1, pixels2, pixels) {
        var d1 = pixels1.data;
        var d2 = pixels2.data;
        var d = pixels.data;
        for(var i=0; i<pixels.data.length; i++ ){
            d[i] = (d1[i] + d2[i]) / 2;
        }
        return pixels;
    }
    var ctx1 = canvas1.getContext('2d');
    var ctx2 = canvas2.getContext('2d');
    var ctx = combCanvas.getContext('2d');

    var pixels1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    var pixels2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    var pixels = ctx.getImageData(0, 0, combCanvas.width, combCanvas.height);

    // image processing
    var pixels = filter(pixels1, pixels2, pixels);

    // Canvas에 다시 그린다.
    ctx.putImageData(pixels, 0 , 0);
}


function main()
{
    // 1. canvas 객체 생성 : image를 그릴 대상
    var contentCanvas = document.getElementById('contentCanvas');
    var styleCanvas = document.getElementById('styleCanvas');
    var combCanvas = document.getElementById('combCanvas');

    // 2. image file load button 에 대한 event handler 를 연결
    var loadBtn1 = document.getElementById('loadButton1');
    var loadBtn2 = document.getElementById('loadButton2');
    // event handler 함수에 추가적인 argument를 주는 방식
    loadBtn1.addEventListener('change', (e) => eventInputBtn(e, contentCanvas), false);
    loadBtn2.addEventListener('change', (e) => eventInputBtn(e, styleCanvas), false);

    // 3. filter button 에 대한 event handler
    var filterBtn = document.getElementById('filterButton');
    filterBtn.addEventListener('click', (e) => eventFilterBtn(e, contentCanvas, styleCanvas, combCanvas), false);
}

main();


