//获取id class tagName
var get = {
	$id: function(id){
		return typeof id ==='string' ? document.getElementById(id) : id
	},
	$class: function(className, oParent) {		
		var aClass = [],
			reClass = new RegExp("(//s|^)" + className + "($|//s)"),
			aElem = get.$tagName("*", oParent);
		for (var i = 0; i < aElem.length; i++) {
			reClass.test(aElem[i].className) && aClass.push(aElem[i])
		}
		return aClass
	},
	$tagName: function(elem, obj){
		return (obj || document).getElementsByTagName(elem);
	} 
}
//获取样式
function getStyle (obj, attr) {
	return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr])	
}

function addHandler(element, type, handler) {			
	return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler)
}

//全屏背景
//obj 容器对象
//src 图片路径
function background(obj, src) {
	//初始化
	var oBgM = get.$id(obj);
	if(!oBgM) return;
	var oImg = new Image(); 
	oImg.src = src;

	//加载图片插入文档中
	oImg.onload = function () {
		oBgM.innerHTML = '<img src="' + oImg.src + '" width="' + oImg.width + '" height="' + oImg.height + '">';
		
		resizeImage();		
	}

	//改版窗口大小时
	addHandler(window, 'resize', resizeImage);

	//设置图片尺寸
	function resizeImage() {
		var imgObj = get.$tagName('img', oBgM)[0],
			iWinW = document.documentElement.clientWidth,
			iWinH = document.documentElement.clientHeight,
			iImgW = getStyle(imgObj, 'width'),
			iImgH = getStyle(imgObj, 'height');
		oBgM.style.width = iWinW + 'px';
		oBgM.style.height = iWinH + 'px';
		//console.log(iImgW+'-'+iImgH)
		if(iWinW > iWinH) {
			if(iImgW > iImgH) {
				//console.log('iWinW:' + iWinW + '-' + "iWinH:" + iWinH)
				if(iWinW/iWinH > iImgW/iImgH) {
					imgObj.style.width = iWinW + 'px';					
					imgObj.style.height = Math.round(iImgH * (iWinW / iImgW)) + 'px';
				} else {
					imgObj.style.height = iWinH + 'px';
					imgObj.style.width = Math.round(iImgW * (iWinH / iImgH)) + 'px';
				}				
			} else {
				imgObj.style.width = iWinW + 'px';					
				imgObj.style.height = Math.round(iImgH * (iWinW / iImgW)) + 'px';
			}
		} else {
			if(iImgW > iImgH) {
				imgObj.style.height = iWinH + 'px';
				imgObj.style.width = Math.round(iImgW * (iWinH/iImgH)) + 'px';				
			} else {				
				if(iWinH/iWinW > iImgH/iImgW) {
					imgObj.style.height = iWinH + 'px';
					imgObj.style.width = Math.round(iImgW * (iWinH / iImgH)) + 'px';				
				} else {
					imgObj.style.width = iWinW + 'px';					
					imgObj.style.height = Math.round(iImgH * (iWinW / iImgW)) + 'px';
				}
			}        
		}
		//设置居中
		imgObj.style.marginLeft = -(getStyle(imgObj, 'width')-iWinW)/2 + 'px';
		imgObj.style.marginTop = -(getStyle(imgObj, 'height')-iWinH)/2 + 'px';
	}	
}

//左右滚动
function Roll ()
{
	this.initialize.apply(this, arguments)	
}
Roll.prototype =
{
	initialize: function (obj)
	{
		var _this = this;
		this.obj = get.$id(obj);
		this.oLeft = get.$class("case-left", this.obj)[0];
		this.oRight = get.$class("case-right", this.obj)[0];
		this.oList = get.$tagName("ul", this.obj)[0];
		this.aItem = this.oList.children;
		this.timer = null;
		this.autoTimer = null;
		this.iWidth = this.aItem[0].offsetWidth || 180;
		this.oList.style.width = this.iWidth * this.aItem.length;
		this.oLeft.onclick = function ()
		{
			_this.left()	
		};
		this.oRight.onclick = function ()
		{
			_this.right()
		}
		this.autoTimer = setInterval(function() {
            _this.right()
        }, 3000);
        this.obj.onmouseover = function() {
            clearInterval(_this.autoTimer)
        };

        this.obj.onmouseout = function() {
            _this.autoTimer = setInterval(function() {
                _this.right()
            }, 3000)
        };
	},
	left: function ()
	{
		this.oList.insertBefore(this.aItem[this.aItem.length - 1], this.oList.firstChild);
		this.oList.style.left = -this.iWidth + "px";
		this.doMove(0)
	},
	right: function ()
	{
		this.doMove(-this.iWidth, function ()
		{
			this.oList.appendChild(this.aItem[0]);
			this.oList.style.left = 0;	
		})
	},
	doMove: function (iTarget, callBack)
	{
		var _this = this;
		clearInterval(this.timer)
		this.timer = setInterval(function ()
		{
			var iSpeed = (iTarget - _this.oList.offsetLeft) / 5;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			_this.oList.offsetLeft == iTarget ? (clearInterval(_this.timer), callBack && callBack.apply(_this)) : _this.oList.style.left = iSpeed + _this.oList.offsetLeft + "px"
		}, 30)
	}
};
