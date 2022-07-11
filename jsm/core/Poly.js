import Matrix4 from "./Matrix4.js"

function alphaComposite(ctx) {
	const { globalAlpha, globalAlpha2, parent, children } = this
	const a = parent ? parent.globalAlpha2 * globalAlpha : globalAlpha
	this.globalAlpha2 = a
	ctx.globalAlpha = a
}

/*默认属性*/
const defAttr = () => ({
	//顶点集合，vec3集合
	vertices: [],

	//绘图方式相关
	close: false,
	shadow: false,

	//样式相关
	fillStyle: null,
	strokeStyle: null,
	lineWidth: 1,
	lineDash: [],
	lineDashOffset: 0,
	lineCap: 'butt',
	lineJoin: 'miter',
	miterLimit: 10,
	shadowColor: 'rgba(0,0,0,0)',
	shadowBlur: 0,
	shadowOffsetX: 0,
	shadowOffsetY: 0,

	//变换相关
	matrix:new Matrix4(),

	//合成相关
	globalAlpha: 1,
	globalAlpha2: 1,
	globalCompositeOperation: 'source-over',

	//可见性
	visible: true,

	//父级
	parent: null,
})

/*Poly 多边形*/
export default class Poly {
	constructor(attr = {}) {
		Object.assign(this, defAttr(), attr)
		//修改器集合：修改器统一具备draw(ctx) 接口
		this.modifiers = []
	}
	draw(ctx,matrix) {
		if (!this.visible) {
			return
		}
		ctx.save()
		this.drawPoly(ctx,matrix)
		ctx.restore()
	}

	drawPoly(ctx,matrix) {

		/*透明度合成*/
		this.alphaComposite(ctx)

		/*全局合成*/
		this.globalComposite(ctx)

		/*建立路径*/
		this.crtPath(ctx,matrix)

		/* 投影 */
		this.setShadow(ctx)

		/*描边*/
		this.drawStroke(ctx)

		/*填充*/
		this.drawFill(ctx)

		/*修改器*/
		this.drawModifies(ctx)
	}

	/*变换*/
	transform(ctx) {
		transform.call(this, ctx)
	}

	/*透明的合成*/
	alphaComposite(ctx) {
		alphaComposite.call(this, ctx)
	}

	/*全局合成*/
	globalComposite(ctx) {
		ctx.globalCompositeOperation = this.globalCompositeOperation
	}

	/*绘制投影*/
	setShadow(ctx) {
		const { shadow, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY } =
			this
		if (shadow) {
			ctx.shadowColor = shadowColor
			ctx.shadowBlur = shadowBlur
			ctx.shadowOffsetX = shadowOffsetX
			ctx.shadowOffsetY = shadowOffsetY
		}
	}

	/*绘制描边*/
	drawStroke(ctx) {
		const {
			close,
			strokeStyle,
			lineWidth,
			lineCap,
			lineJoin,
			miterLimit,
			lineDash,
			lineDashOffset,
		} = this
		if (strokeStyle) {
			ctx.strokeStyle = strokeStyle
			ctx.lineWidth = lineWidth
			ctx.lineCap = lineCap
			ctx.lineJoin = lineJoin
			ctx.miterLimit = miterLimit
			ctx.lineDashOffset = lineDashOffset
			ctx.setLineDash(lineDash)
			close && ctx.closePath()
			ctx.stroke()
		}
	}
	/*绘制填充*/
	drawFill(ctx) {
		const { fillStyle } = this
		if (fillStyle) {
			ctx.fillStyle = fillStyle
			ctx.fill()
		}
	}
	/*绘制修改器*/
	drawModifies(ctx) {
		const { modifiers } = this
		modifiers.forEach((modifier) => {
			modifier.draw(ctx)
		})
	}

	/*绘制多边形
	 *   draw(ctx,fn) 绘图，fn在创建路径拦截路径的的选择
	 *   isPointInPath(ctx,pos)测试点是否在路径中（基于未变换的数据绘制路径，让鼠标点去变换）
	 * */
	crtPath(ctx,matrix) {
		let { vertices } = this
		/*连点成线*/
		ctx.beginPath()
		const len = vertices.length
    /* 根据初始顶点和矩阵计算路径 */
		for (let i = 0; i < len; i++) {
      const {x,y}=vertices[i].clone().applyMatrix4(matrix)
      // console.log(x,y);
			ctx.lineTo(x,y)
		}
	}

	/*检测顶点是否在路径中*/
	isPointInPath(ctx, { x, y }) {
		ctx.save()
		//创建路径
		this.crtPath(ctx)
		const bool = ctx.isPointInPath(x, y)
		ctx.restore()
		return bool
	}

	

	/*拷贝顶点集合*/
	copyVertices(vs) {
		const { vertices } = this
		vs.forEach((v, i) => {
			const curV = vertices[i]
			if (curV) {
				curV.copy(v)
			} else {
				vertices[i] = v
			}
		})
	}
}
