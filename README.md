# a-canvas--ts

---

### 下载 & 引用

```javascript

  npm i a-canvas--ts
  
  import ACanvas from 'ACanvas'

  ACanvas.start('xx','xx','xx')

```

### 说明

> 前身是 tag-canvas，很不错的一个转canvas3D圆形工具，但是相关文档几乎已经没有，所以自己重构了一下并补全文档，修改了一些已经弃用的语法和删除一些功能

### 改动

#### 删除以下功能
- 播放音频功能 (感觉没什么意义)
- 图片功能 (这个插件不支持使用图片，有图片需求的小伙伴还是要用tag-canvas)

#### 修改如下
- `start(xx,xx,xx)` 第二个参数不再只是获取元素 id，也可以通过 `.className` 实现
- `updata` 函数暂时以 `reload` 代替
##### 关于 a 标签
- a 标签内使用 `br` 将不会换行，因为会有额外 bug 增加，所以去掉了这个功能
- 设置字体时，新加/修改：`textFontStyle、textFontFamily` 属性，如果要使用样式覆盖的话，请使用 `font` 属性 

### 初始化 option 所有参数说明

| 键值           | 类型     | 默认值                         | 说明                                                                 |
| -------------- | -------- | ------------------------------ | -------------------------------------------------------------------- |
| shape          | string   | 'sphere'                       | 共有动画模式：`sphere`、`vcylinder`、`hcylinder`、`vring`、`hring`   |
| lock           | string   | null                           | 锁定方向：'x' 或者 'y'                                               |
| interval       | number   | 20                             | 动画执行间隔时间，以毫秒为单位，值越小越慢，否则反之                 |
| activeCursor   | string   | 'pointer'                      | 元素瞄准后的样式，可参考 `cursor` 属性                               |
| textColour     | string   | '#000000'                      | 默认文字颜色，也可通过元素样式覆盖                                   |
| textFontStyle  | string   | ''                             | 遵循css中的font，同 style、weight 两个属性                           |
| textHeight     | number   | 16                             | 遵循css中的font，同 size 属性，设置默认文字大小                      |
| textFontFamily | string   | 'Helvetica, Arial, sans-serif' | 遵循css中的font，同 family 属性                                      |
| initial        | number[] | null                           | 球体朝向移动，第一个参数为 `x`，第二个参数为 `y`，推荐使用 [0.1,0.1] |
| hideElement    | boolean  | true                           | 是否隐藏 Element 元素                                                |
| freezeActive   | boolean  | false                          | 瞄准元素立即停止                                                     |
| freezeDecel    | boolean  | false                          | 瞄准元素进行减速                                                     |
| frontSelect    | boolean  | true                           | 画布背面/远处的元素是否可以瞄准点击                                  |
| zoom           | number   | 1                              | 缩放级别                                                             |
| wheelZoom      | boolean  | true                           | 是否启用滚轮/手势缩放                                                |
| zoomMin        | number   | 0.3                            | 最小缩放值                                                           |
| zoomMax        | number   | 3                              | 最大缩放值                                                           |
| zoomStep       | number   | 0.05                           | 每次鼠标滑动滚轮时的缩放变焦量                                       |
| dragControl    | boolean  | false                          | 控制是否可以拖动旋转                                                 |
| reverse        | boolean  | false                          | 瞄准画布后的旋转样式，前提 `dragControl:false`                       |
| dragThreshold  | number   | 0                              | 拖动的距离阀值，前提 `dragControl:true`                              |
| depth          | number   | 0.5                            | 控制 z 轴距离（0.0-1.0）                                             |
| maxBrightness  | number   | 1                              | 距离远处的字体最大透明度                                             |
| minBrightness  | number   | 0.1                            | 距离远处的字体最小透明度                                             |
| maxSpeed       | number   | 0.01                           | 控制旋转最大速度                                                     |
| minSpeed       | number   | 0                              | 控制旋转最小速度                                                     |
| decel          | number   | 0.95                           | 拖动后的缓冲减速                                                     |
| radiusX        | number   | 1                              | 画布 X 轴扩大倍数                                                    |
| radiusY        | number   | 1                              | 画布 Y 轴扩大倍数                                                    |
| radiusZ        | number   | 1                              | 画布 Z 轴扩大倍数                                                    |
| stretchX       | number   | 1                              | 画布延伸 X 轴倍数                                                    |
| stretchY       | number   | 1                              | 画布延伸 Y 轴倍数                                                    |
| offsetX        | number   | 0                              | 画布偏移 X 轴距离(px)                                                |
| offsetY        | number   | 0                              | 画布偏移 Y 轴距离(px)                                                |

### 演示样式

> 以下函数均以此块标签模板为例

```html
  <canvas id="canvas"></canvas>
  <div class="a-list" id="a-list">
      <a id="a1">a1标签</a>
      <a id="a2">a2标签</a>
  </div>
```

##### start() 初始画布

> 类型：**Function** `start(string,string,object)`

- argumen[1]
  + 画布ID
- argumen[2]
  + 元素列表ID / Class 

```javascript
  // 第二个参数 .a-list #a-list 都可以
  start('canvas','.a-list',{option...})
```

##### tagToFront() 元素置于中心点

> 类型：**Function** `tagToFront(string,object)`

> object 参数

- `id: string`
  + 当前画布的 id
- `callback: (Canvas,A元素) => void`
  + 回调函数里的第一个参数为当前画布，第二个参数为当前事件元素
- `time: number` 默认:500 毫秒
  + 执行动画的时间

```javascript
  tagToFront('canvas',{
      id:"a1",
      time: 500,
      callback: (c, a) => {}
  })
```

##### rotateTag() 元素置于自定义位置

> 类型：**Function** `rotateTag(string,object)`

> object 参数

- `id: string`
  + 当前画布的 id
- `callback: (Canvas,A元素) => void`
  + 回调函数里的第一个参数为当前画布，第二个参数为当前事件元素
- `time: number` 默认:500 毫秒
  + 执行动画的时间
- `lat: number`
  + 元素移动到 X 轴某处
- `lng: number`
  + 元素移动到 Y 轴某处
  
```javascript
  rotateTag('canvas',{
      id:"a1",
      time: 500,
      lat: 10, 
      lng: 10,
      callback: (c, a) => {}
  })
```

##### setDirection() 画布朝向旋转

> 类型：**Function** `setDirection(string,number[])`

- `[x, y]`
  + x 轴从 0 到 0.1，Y 轴从 0 到 0.1，所以是向右上方缓慢行驶

```javascript
  setDirection('canvas',[0.1,0.1])
```

##### updata() 更新元素数据 (暂以reload为代替)

> 类型：**Function** `updata(string)`

```javascript
  updata('canvas')
```

##### reload() 更新画布

> 类型：**Function** `reload(string)`

```javascript
  reload('canvas')
```

##### delete() 清除画布

> 类型：**Function** `delete(string)`

```javascript
  delete('canvas')
```
