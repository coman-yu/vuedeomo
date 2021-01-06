const {
  // insert,
  // updateById,
  // remove,
  find,
  remove,
  updateById,
  insert
} = require("../utils/mongo");

const {
  Enum
} = require('../utils/Enum');

const express = require('express');

const router = express.Router();
/* 
  1.
*/
// 获取全部
router.get('/', async (req, res) => {
  let {
      pageSize,
      pageNo,
  } = req.query;

  const skip = (pageNo - 1) * pageSize;
  try {
      let result = await find("channel", {}, {
          pagesize: pageSize * 1,
          skip: skip
      });
      res.send(Enum(1001, result));
  } catch (e) {
      res.send(Enum(1002));
  }
})

// 添加
router.post("/add/:id", async (req, res) => {
    let {
        id
    } = req.params
     // 根据id查找当前的数据
     let result = await find('channel',{
         _id:id
     })
     result = result[0];
     
     const id1 = result.children.length+1
    let {
       success,
       fail,
       total,
       date,
       name,
    } = req.body
    let newData = {
      success:success*1,
      fail:fail*1,
      total:total*1,
      date,
      name,
      channelId:name,
      label:name,
      id:id1
    }
     result.children.push(newData)
    try{
        await updateById('channel',{
          children:result.children
        },id)
        res.send(Enum(1001))
    }catch(err){
        res.send(Enum(1002))
    }
})
// 删除
router.put('/:id', async (req, res) => {
    let {
        id
    } = req.params
     // 根据id查找当前的数据
     let result = await find('channel',{
         _id:id
     })
     let {children} = result[0];
    let {
       currentId
    } = req.body

    children = children.filter(item=>item.id!==currentId*1)
    children = children.map((item,index)=>{
      item.id=index+1;
      return item;
    });
      result.children = children;
    try{
        await updateById('channel',{
          children:result.children
        },id)
        res.send(Enum(1001))
    }catch(err){
        res.send(Enum(1002))
    }
})
// 按条件查找
router.post('/search',async(req,res)=>{
 // 根据id查找当前的数据
//  console.log(11);
 let {
   startDate,
   endDate,
   selectVal
 }=req.body
//  console.log(startDate,selectVal);
 startDate = new Date(startDate);
 endDate = new Date(endDate);
 startDate = startDate.getTime();
 endDate = endDate.getTime()
 let result = await find('channel')
 let {children} = result[0];
 children = children.map(item=>{
   item.date = new Date(item.date);
   
   item.date = item.date.getTime();
   return item
 })
 if(selectVal==0){
    children = children.filter(item=>item.date>=startDate&&item.date<=endDate)
 }else{
    children = children.filter(item=>item.id==selectVal)
    children = children.filter(item=>item.date>=startDate&&item.date<=endDate)
 }
 let arr =[];
 children = children || [];
 children.forEach(item=>{
   arr.push(item.id)
 })
try{
    res.send(Enum(1001,arr))
}catch(err){
    res.send(Enum(1002))
}

})
// 获取单个信息
router.get('/:id', async (req, res) => {
  const {
      id
  } = req.params;
  // console.log('id=',id)

  const result = await find('channel', {
      _id: id
  })
  // console.log(result)
  res.send(Enum(1001, result));
})

// 更改信息
router.put('/modify/:id', async (req, res) => {
  let {
      id
  } = req.params
   // 根据id查找当前的数据
   let result = await find('channel',{
       _id:id
   })
   const {children} = result[0];
  let {
     success,
     fail,
     total,
     date,
     name,
     currentId
  } = req.body

  let newData = {
    success:success*1,
    fail:fail*1,
    total:total*1,
    date,
    name,
    channelId:name,
    label:name,
    id:currentId
  }
  for(let i=0;i<children.length;i++){
    if(currentId===children[i].id){
        Object.assign(children[i],newData)
    }
  }
    result.children = children;
  try{
      await updateById('channel',{
        children:result.children
      },id)
      res.send(Enum(1001))
  }catch(err){
      res.send(Enum(1002))
  }
//   try {
//       await updateById('channel', newData, id)
//       res.send(Enum(1001))
//   } catch (e) {
//       res.send(Enum(1002))
//   }
})
module.exports = router