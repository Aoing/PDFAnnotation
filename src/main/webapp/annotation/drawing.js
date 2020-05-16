var globalVariables = {
    // 记录历史操作（长度可固定为 20 ，超过 20）
    historyAction : [],

    // 记录历史操作的栈
    historyActionStack : new Stack(),

    // 记录新增的注释的栈
    addAnnotationStack : new Stack(),

    // 记录注释
    annotations : [
        {

            id : null,                             // id 标识
            xStart : 0,                         // 注释起点 x 坐标
            yStart : 0,                         // 注释起点 y 坐标
            width : 100,                        // 注释宽
            height : 100,                       // 注释高
            xEnd : 100,                         // 注释终点 x 坐标
            yEnd : 100,                         // 注释终点 y 坐标
            position : "bottomRight",           // 注释终点相对于起点坐标位置
            mark : "1",                         // 标记
            lineWidth :1,                       // 注释边线宽度
            borderColor: "blue",                // 注释边线颜色
            isSelected : false,                 // 注释是否被选中的标记
            author : "author",                  // 添加注释的作者
            authors : [],                       // 注释作者组
            modifyUserName : [],                // 修改注释的用户名称
            modifyTime : [],                    // 修改注释的时间
            addtime : "2020-5-16 12:05:21",     // 新增注释时间
            page : 0,                           // 注释所在的页面
            type : 1,                           // 注释类型：1 矩形，2 圆形

            /*this.id = null;                             // id 标识
            this.xStart = 0;                         // 注释起点 x 坐标
            this.yStart = 0;                         // 注释起点 y 坐标
            this.width = 100;                        // 注释宽
            this.height = 100;                       // 注释高
            this.xEnd = 100;                         // 注释终点 x 坐标
            this.yEnd = 100;                         // 注释终点 y 坐标
            this.position = "bottomRight";           // 注释终点相对于起点坐标位置
            this.mark = "1";                         // 标记
            this.lineWidth = 1;                       // 注释边线宽度
            this.borderColor = "blue";                // 注释边线颜色
            this.isSelected = false;                 // 注释是否被选中的标记
            this.author = "author";                  // 添加注释的作者
            this.authors = [];                       // 注释作者组
            this.modifyUserName = [];                // 修改注释的用户名称
            this.modifyTime = [];                    // 修改注释的时间
            this.addtime = "2020-5-16 12:05:21";     // 新增注释时间
            this.page = 0;                           // 注释所在的页面
            this.type = 1;                           // 注释类型：1 矩形，2 圆形*/
        },
    ],
}

function DrawAnnotation(parentDiv, canvas){

    // 获取添加 canvas 画布的父容器
    this.parentDiv = null;
    if (parentDiv != null){
        this.parentDiv = parentDiv;
    }

    // 获取画布对象
    if (canvas == null){
        this.canvas = this.createCanvas();
        // 追加画布到传入的父容器中
        this.parentDiv.append(this.canvas);
    }else{
        this.canvas = canvas;
    };

    this.context = this.canvas.getContext("2d");

    this.annotations = globalVariables.annotations;
}

DrawAnnotation.prototype = {
    constructor : DrawAnnotation,


    // 创建画布
    createCanvas : function () {
        let canvas = document.createElement("canvas");

        // 设置画布尺寸
        canvas.width = this.parentDiv.offsetWidth - 2 * this.parentDiv.style.borderWidth.substring(0, this.parentDiv.style.borderWidth.length - 2) ;
        canvas.height = this.parentDiv.offsetHeight -  2 * this.parentDiv.style.borderWidth.substring(0, this.parentDiv.style.borderWidth.length - 2) ; ;

        // 输出日志
        console.log(" 父容器的 top 值："+ this.parentDiv.style.top);
        console.log(" 父容器的 left 值："+ this.parentDiv.style.left);

        // 设置画布为浮动，否则是添加在父容器中所有子元素的后面
        canvas.style.position = "absolute";

        // 设置画布左上角坐标, 否则画布的位置还是位于所有子元素后面
        /*canvas.style.top = 0;
        canvas.style.left = 0;*/
        canvas.style.border = "solid";
        canvas.style.borderColor = "red";
        canvas.style.borderWidth = "1";

        // 追加画布到传入的父容器中
        // parentDiv.append(this.canvas);

        return canvas;
    },

    // 添加注释对象
    addAnnotation : function () {
        let annotation = {
            id : null,                             // id 标识
            xStart : 0,                         // 注释起点 x 坐标
            yStart : 0,                         // 注释起点 y 坐标
            width : 100,                        // 注释宽
            height : 100,                       // 注释高
            xEnd : 100,                         // 注释终点 x 坐标
            yEnd : 100,                         // 注释终点 y 坐标
            position : "bottomRight",           // 注释终点相对于起点坐标位置
            mark : "1",                         // 标记
            lineWidth :1,                       // 注释边线宽度
            borderColor: "blue",                // 注释边线颜色
            isSelected : false,                 // 注释是否被选中的标记
            author : "author",                  // 添加注释的作者
            authors : [],                       // 注释作者组
            modifyUserName : [],                // 修改注释的用户名称
            modifyTime : [],                    // 修改注释的时间
            addtime : "2020-5-16 12:05:21",     // 新增注释时间
            page : 0,                           // 注释所在的页面
            type : 1,                           // 注释类型：1 矩形，2 圆形
        };

        // 将注释对象保存到注释数组
        if (annotation.width != 0 && annotation.height != 0) {
            globalVariables.annotations.push(annotation);
        }
    },

    // 绘制注释
    drawAnnotations : function() {
        if (globalVariables.annotations.length > 0){
            // 清除画布，准备绘制，如果不清除会导致绘制很多矩形框
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < globalVariables.annotations.length; i++){
                this.drawAnnotation(globalVariables.annotations[i]);
            }
        }
    },

    // 绘制单个注释
    drawAnnotation : function(annotationElement){
        if (annotationElement != null){
            switch (annotationElement.type) {
                case 1 :
                    this.drawRect(annotationElement);
                    break;
                case 2 :
                    this.drawCircle(annotationElement);
                    break;
                default :
                    break;
            }
        }
    },

    // 绘制矩形
    drawRect : function (annotationElement) {
        // 通过路径绘制矩形，避免鼠标绘制时终点与起点相对位置对绘制产生的影响
        this.context.beginPath();
        this.context.moveTo(annotationElement.xStart, annotationElement.yStart);
        this.context.lineTo(annotationElement.xEnd, annotationElement.yStart);
        this.context.lineTo(annotationElement.xEnd, annotationElement.yEnd);
        this.context.lineTo(annotationElement.xStart, annotationElement.yEnd);
        this.context.lineTo(annotationElement.xStart, annotationElement.yStart);

        this.context.strokeStyle = "red";
        this.context.lineWidth = 1;
        this.context.stroke();
    },

    // 绘制圆形
    drawCircle : function (annotationElement) {

    }
}


// 使用构造函数和原型模式创建栈对象
function Stack(){
    this.first = null;
    this.last = null;
    this.data = [];
}

Stack.prototype = {
    // 使 constructor 属性重新指向构造函数
    constructor : Stack,

    // 添加元素
    add : function(element){
        this.data.push(element);
        if (this.data.length > 0){
            this.first = this.data[0];
            this.first = this.data[this.data.length - 1];
        }
    },

    // 弹出栈顶元素
    pop : function () {
        return this.data.pop();
    },

    // 获取栈顶元素
    peek : function () {
        return this.data[this.data.length - 1];
    }

}