# ajax1

## 属性

### `url`

目标地址

### `data`

发送的数据

### `type`

类型，`get`或者`post`

### `handle-as`

默认为`json`

## 方法

### `url`

更新目标地址
```js
tag.url('/x')
```

### `data`

更新发送的数据，接收一个对象
```js
tag.data({
	a: '1'
})
```

### `type`

更新类型
```js
tag.type( 'post' )
```

### `handleAs`

更新处理方式
```js
tag.handleAs( 'jsonp' )
```

### `send`

发送，返回一个promise对象
```js
tag.send().then(json => {})
```

## 事件

### `send`

### `success`

### `error`

### `complete`
