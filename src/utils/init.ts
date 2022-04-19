export let option = {
    z1: 20000,
    z2: 20000,
    z0: 0.0002,
    // 瞄准元素立即停止
    freezeActive: false,
    // 瞄准元素进行减速
    freezeDecel: false,
    // 鼠标样式
    activeCursor: 'pointer',
    // 瞄准元素后的样式
    reverse: false,
    // 控制 z 轴距离（0.0-1.0）
    depth: 0.5,
    // 最大速度
    maxSpeed: 0.01,
    // 最小速度
    minSpeed: 0,
    // 离开区域后的缓冲减速
    decel: 0.95,
    // 动画帧之间的间隔，以毫秒为单位 值越小越慢 否则反之
    interval: 20,
    // 距离远处的字体最小透明度
    minBrightness: 0.1,
    // 距离远处的字体最大透明度
    maxBrightness: 1,
    // 默认颜色
    textColour: '#000000',
    // 默认字体大小
    textHeight: 16,
    // 默认字体
    textFont: 'Helvetica, Arial, sans-serif',
    // 初始旋转，水平和垂直为数组，例如： 0.8，-0.3 值乘以 maxSpeed
    // [0.1, 0.1]
    initial: null,
    // 设置为true以自动隐藏 a 元素
    hideTags: true,
    // 设置为 true 以防止在远处的文字被选择
    frontSelect: false,
    // 调整画布中标签的相对大小 较大的值将放大 较小的值将缩小
    zoom: 1,
    // 使用鼠标滚轮或滚动手势可以放大和缩小球体
    wheelZoom: true,
    // 最小缩放值
    zoomMin: 0.3,
    // 最大缩放值
    zoomMax: 3,
    // 每次移动鼠标滚轮时缩放变焦量
    zoomStep: 0.05,
    shape: 'sphere',
    // 锁定 y 或者 x 旋转轨迹
    lock: null,
    // 球体扩大倍数
    radiusX: 1,
    radiusY: 1,
    radiusZ: 1,
    // 球体延伸倍数
    stretchX: 1,
    stretchY: 1,
    // 球体偏移量
    offsetX: 0,
    offsetY: 0,
    // 控制是否可以拖动旋转
    dragControl: false,
    // 拖动的距离阀值
    dragThreshold: 0,
}