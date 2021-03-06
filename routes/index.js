/*
 * Routers!
 *
 * Available Routes
 * ================
 *
 * GET /
 * GET /index
 * GET /about
 *
 */

module.exports = function (app){
  
  var systemVersion = require('../package').version;
  var Renderer = require('../models/render');
  var renderer = new Renderer('');
  var setLang = require('../models/localization').setLang;
  var db = app.db;
  var Log = require('../models/log');
  var Fortress = require('../models/security');
  
  var config = {
  'systemVersion': systemVersion,
  'renderer': renderer,
  'setLang': setLang,
  'db': db,
  'Log': Log,
  'Fortress': Fortress
  };
  
  var index = function(req, res){
    var htmlcache;
    if (htmlcache) {
      res.send(htmlcache);
    } else {
      require('fs').readFile('./public/index.html', function(err, data){
        if (err) {
          res.status(500).send(err);
        } else {
          htmlcache = data.toString();
          res.send(htmlcache);
        }
      });
    }
    /*var mongourl = db.generate_mongo_url();
    require('mongodb').connect(mongourl, function(err, conn){
      conn.collection('archive', function(err, coll){
        coll.find({ 'accesslevel' : {$lte : '1'} }, function(err, cursor){
          var contents = '';
          if (cursor) {
            cursor.sort({'time': 1});
      cursor.limit(3);
            cursor.each(function(err, entry) {
              if (err)
              {
                contents = '<p>' + err + '</p>';
                return;
              }
              if(entry == null) {
                conn.close();
                if (contents == '')
                  contents = renderer.no_entry_found();
                res.render(renderer.getView() + 'index', { 
                  layout: renderer.getView() + 'layout',
          title: 'index',
                  version: 'NTWRK>>SYS>' + systemVersion,
                  archive_content: contents,
                  access: access_li
                });
                return;
              }
              contents += renderer.article_entry_thumbnail(entry,
                                                           false,
                               4);
            });
          }
        });
      });
    });*/
  }
 
  app.get('/', index);
  
  app.get('/index', index);
  
  app.get('/about',function(req, res){
    setLang(req, renderer);
    var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    res.render(renderer.getView() + 'about', { 
      title: 'about',
      layout: renderer.getView() + 'layout',
      version: 'NTWRK>>SYS>' + systemVersion,
      access: access_li
    });
  });
  
  app.get('/admin', function(req, res){
    setLang(req, renderer);
    var access_li = (req.session.access == null) ? 
        renderer.nav_dropdown_li('NA',-1) : 
        renderer.nav_dropdown_li(req.session.access.id,req.session.access.clearance.level);
    var info = {
      mongourl: db.generate_mongo_url(),
    }
    if (req.session.access && req.session.access.clearance.admin){
      res.render('admin', { 
          title: '',
          info: info,
          layout: renderer.getView() +'layout',
          version: 'NTWRK>>IDN>' + systemVersion,
          access: access_li,
          nav_archive: renderer.nav_extend({})
        });
    } else {
      res.status(401).render(renderer.getView() + '401', { 
          title: '',
          layout: renderer.getView() +'layout',
          version: 'NTWRK>>IDN>' + systemVersion,
          access: access_li,
          nav_archive: renderer.nav_extend({})
        });
    }
  });

  app.post('/apply', function(req, res){
    var data = req.body;
    db.insert('applications', data, function(err){
      if (err)
        res.status(500).send(err);
      else {
        res.status(201).send('OK');
      }
    });
  });

  app.post('/admin', function(req, res){
    if (! req.session.admin) {
      if (req.body.accesscode === 'HAILHUSTBAIDU32767')
        req.session.admin = true;
      else
        return res.status(403).send({err: 'Access Denied'});
    }
    var html = '';
    db.find_and_render('application', 'applications', {}, {'_id': -1}, 0, function(contents){
      html += contents;
      res.send({html: html});
    }
    , renderer);
  });

  app.post('/admin/manage', function(req, res){
    if (! req.session.admin) {
      return res.status(403).send({err: 'Access Denied'});
    }
    db.remove('applications', {'_id' : new db.ObjectID(req.body.objid)},function(err){
      if (err)
        return res.status(500).send(err);
      else {
        res.status(202).send({'ok':true});
      }
    });
  });
  
  /* require('./archive')(app, config);
  require('./idn')(app, config);
  require('./idn_archive')(app, config);
  require('./idn_access')(app, config);
  require('./idn_contact')(app, config); */

  //app.get('/webapp',routes.webapp);
  //app.get('/webapp/:appname',routes.webapp_app);
}