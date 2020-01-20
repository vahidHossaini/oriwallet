var uuid=require("uuid");
class walletManager
{

	constructor(disc)
	{
		this.disc=disc
	}
    request(_id,type,value,userid,func)
	{
        return this.disc.run('wallet','request',{data:{_id,type,value,userid}},func)
	}
}
module.exports = class walletIndex
{
	constructor(config,dist)
	{
		this.config=config.statics;
		this.context=this.config.context;
        this.bootstrap=require('./bootstrap.js');
        this.enums=require('./struct.js');
        this.tempConfig=require('./config.js');
		global.wallet=new walletManager(dist);
	}
    
	async balance(msg,func,self)
    {
		var dt=msg.data;
		var session=msg.session;
        var balance=await global.SearchOne(self.context,'wallet_balance',{where:{userid:session.userid}})
        return func(null,balance)
    }
	async request(msg,func,self)
	{
		var dt=msg.data; 
        var data =await global.db.SearchOne(self.context,'wallet_request',{where:{_id:dt._id}});
            console.log('--->1')
        if(!data)
        {  
            var balance=await global.db.Search(self.context,'wallet_request',{
                where:{ $and:[{userid:dt.userid},{type:dt.type}]},
                order:[["userid","desc"]],
                select:['userid',{type:'function',name:'sum',field:'value',title:'value'}]
                },{})
            var bvalue=0;
            console.log('--->2')
            if(balance.value.length)
            {
                bvalue = balance.value[0].value;
            }
            console.log('--->3')
            if(dt.value<0)
            {
                if(bvalue+dt.value<0)
                {
                    return func({m:"wallet001"})
                }
            }
            console.log('--->4')
            await global.db.Save(self.context,'wallet_request',['_id'],{_id:dt._id,type:dt.type,value:dt.value,userid:dt.userid});
        }
        var endbalance=await global.db.Search(self.context,'wallet_request',{
                where:{ $and:[{userid:dt.userid},{type:dt.type}]},
                order:[["userid","desc"]],
                select:['userid',{type:'function',name:'sum',field:'value',title:'value'}]
                },{})
        var endvalue=0;
        if(endbalance.value.length)
        {
            endvalue=endbalance.value[0].value
        }            
        await global.db.Save(self.context,'wallet_balance',['userid'],{userid:dt.userid,balance:endvalue,updated:new Date()})        
		return func(null,endvalue);
	}
}