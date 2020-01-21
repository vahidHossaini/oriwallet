module.exports = class walletBootstrap{
  constructor(config)
  {
    this.funcs=[ 
      {
          name:'request', 
      },     
      {
          name:'exchange', 
      },   
      {
          name:'balance', 
      },  
	  
	  
	   
    ]
    this.auth=[ 
            {
                role: 'login',
                name: 'balance'
            },
        ]
  }
}