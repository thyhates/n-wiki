const bytebuffer=require("bytebuffer")
// console.log(typeof dcodeIO.ByteBuffer)
var msg_type=1;
var rid=1;
var fid=1030001;
var buf=new bytebuffer(12,false,false);
buf.writeInt32(msg_type,0);
buf.writeInt32(rid,4);
buf.writeInt32(fid,8);
console.log(buf.buffer);