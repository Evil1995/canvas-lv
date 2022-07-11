当前可以使用四维矩阵变换图形：
const poly=new Poly({
  strokeStyle:'#000',
  vertices:[
    new Vector3(200,200,0),
    new Vector3(200,300,0),
    new Vector3(300,300,0),
  ],
  matrix:new Matrix4(
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    100,100,0,1,
  )
})


接下来要做的：

1.matrix4 按照three.js的逻辑写，输入的时候用行主序，计算的时候用列主序

2.把相机的视图矩阵、投影矩阵、以及视口矩阵引入，使图形可以三维变换。
