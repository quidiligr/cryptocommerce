
const HomeService = require('../services/home.service')

exports.index = async function(req, res, next){
    console.log('5: START home.controller index')
  
    
            let result = await HomeService.index(req.session)
            if(result.statusCode == 200){
                res.render('home/index', result.data)
            }
            else{
                res.render('/error');
            }
            
            
            
    }


exports.dashboard = async function(req, res, next){
    console.log('193: START homer.controller.dashboard')

    if(req.session['user'] == null || req.session.user['username'] == null 
    || req.session.user.username == '' || req.session.user.username == 'guest'){
        res.redirect('/');
    }
    else{
    
    
            let result = await HomeService.dashboard(req.session)
            if(result.statusCode == 200){
                res.render('home/dashboard', result.data)
            }
            else{
                res.render('/error');
            }
            
        }   
            
    }
    