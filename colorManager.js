import { Tween, Easing, Group } from '@tweenjs/tween.js'; // 引入Tween.js库
import { Color } from 'three';
// 这个js的功能是能够在任意时刻获取当前颜色。
// 当前颜色 是一个 从 荧光绿 94ad00 到 荧光黄 ffd300 的渐变色。
// 通过调用getColor()方法，可以获取当前颜色。

const startColor = new Color(0x94ad00);
const endColor = new Color(0xffd300);
let currentColor = startColor;

const tween = new Tween({ color: startColor }) // 创建一个tween对象

//tween 在这两个颜色之间使用 pingPong 模式 ， easing函数为 Easing.Quadratic.InOut

tween.to({ color: endColor }, 2000)
    .easing(Easing.Quadratic.InOut)
    .onUpdate((object) => {
        currentColor = currentColor.lerp(object.color, 0.01);
    })
    .yoyo(true)
    .repeat(Infinity)
    .repeatDelay(500)
    .start();


const group = new Group();
group.add(tween);


export function getColor() {
    const color = currentColor.getHexString();
    return color;
}

export function refreshColorGradientItems() {
    colorGradientItems = Array.from(document.querySelectorAll('.OO-color-gradient'));
    if (!isAnimating) {
        animate();
    }
}

var isAnimating = false;
function animate() {
    // 确保只有一个动画在运行
    isAnimating = true;

    // 如果发现 没有 .OO-color-gradient 元素，停止动画
    if (colorGradientItems.length === 0) {
        isAnimating = false;
        // 尝试每隔一秒重新获取 .OO-color-gradient 元素
        setTimeout(refreshColorGradientItems, 1000);
        return;
    }

    group.update();
    refreshColor();
    requestAnimationFrame(animate);
}

// 为所有的 .OO-color-gradient 元素设置背景色
let colorGradientItems = [];
// 为所有的 .OO-color-gradient-svg 元素设置svg的fill颜色
let colorGradientSvgItems = [];
function refreshColor() {
    const currentColor = getColor();

    scanItems(colorGradientItems,'OO-color-gradient',(item) => {
        item.style.backgroundColor = `#${currentColor}`;
    });

    scanItems(colorGradientSvgItems,'OO-color-gradient-svg',(item) => {
        item.style.fill = `#${currentColor}`;
    });


    if(removeColorGradientSvgItems.length > 0) {
        colorGradientSvgItems = colorGradientSvgItems.filter((item) => !removeColorGradientSvgItems.includes(item));
        removeColorGradientSvgItems = [];
    }


    // debug
    console.log(`#${currentColor.toString(16)}`);
}

function scanItems(itemList,classType,fx){
    let removeItems = [];
    itemList.forEach((item) => {
        if (!item.classList.contains(classType)) {
            removeItems.push(item);
            return;
        }
        fx(item);
    });
    if (removeItems.length > 0) {
        itemList = itemList.filter((item) => !removeItems.includes(item));
    }
}


//-=================== 程序入口 ===================

document.addEventListener('DOMContentLoaded', () => {
    refreshColorGradientItems();
});