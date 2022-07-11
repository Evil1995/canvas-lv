import Matrix4 from "./Matrix4.js";
export default class Scene{
  constructor(param={}){
    const {canvas}=param
    this.children=[]
    this.matrix=new Matrix4()
    this.domElement=canvas?canvas:document.createElement('canvas')
    this.ctx=this.domElement.getContext('2d')
  }
  add(obj){
    obj.parent=this
    this.children.push(obj)
  }
  render(camera) {
    const {ctx,children}=this
		for ( let i = 0, l = children.length; i < l; i ++ ) {
      traverse( children[i],this.matrix )
		}
    function traverse( obj,m ) {
      const {children}=obj
      const m2=m.clone().multiply(obj.matrix)
      if(children){
        for ( let i = 0, l = children.length; i < l; i ++ ) {
          const child=children[ i ]
          traverse(child,m2)
        }
      }else{
        obj.draw(ctx,m2)
      }
    }
	}
  

}