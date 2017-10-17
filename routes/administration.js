var express = require('express');
var router = express.Router();
var async = require('async');
var User = require('../models/User');
var Module = require('../models/Module');
var Model = require('../models/Model');
var FieldType = require('../models/FieldType');
var InstanceSetting = require('../models/InstanceSetting');
var Col = require('../models/Col');
var Field = require('../models/Field');
var ModuleState = require('../models/ModuleState');
var mongoose = require('mongoose');


/* GET users listing. */
router.get('/users', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all users
    users: function(callback) {
      User.find({})
      .exec(callback);
    }

  }, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      console.log(results.users);
      res.render('administration/users', { title: 'Express', user: req.user, users: results.users });
    }
    
  });
});

/* GET default module page. */
router.get('/modules', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all modules
    modules: function(callback) {
      Module.find({})
      .populate('_state')
      .populate('collections')
      .exec(callback);
    },
    states: function(callback) {
      ModuleState.find({}).exec(callback)    
    }

  }, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      res.render('administration/modules', { title: 'Express', user: req.user, modules: results.modules, states: results.states });
    }
    
  });
});


/* GET module listing. */
router.get('/module-list', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all modules
    modules: function(callback) {
      Module.find({})
      .exec(callback);
    }

  }, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      res.render('administration/module-list', { title: 'Express', user: req.user, modules: results.modules });
    }
    
  });
});


/* GET module details. */
router.get('/module/:id', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all modules
    modules: function(callback) {
      Module.find({})
      .exec(callback);
    },
    module: function(callback) {
      Module.findById(req.params.id)
      .populate("_state")
      .exec(callback);
    },
    states: function(callback) {
      ModuleState.find({}).exec(callback);
    }

  }, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      res.render('administration/details-module', { title: 'Express', user: req.user, modules: results.modules, module: results.module, states: results.states });
    }
    
  });
});

/* GET module collections. */
router.get('/module/collections/:id', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all modules
    modules: function(callback) {
      Module.find({})
      .populate('_state')
      .populate('collections')      
      .exec(callback);
    },
    module: function(callback) {
      Module.findById(req.params.id)
      .populate('collections')
      .exec(callback);
    }

  }, function(err, results) {
    if(err) {
      //console.log(err);
    } else {
      res.render('administration/module-collections', { title: 'Express', user: req.user, modules: results.modules, module: results.module });
    }
    
  });
});

/* POST module create collection. */
router.post('/module/collection/create/:id', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  newCol = new Col(req.body);
  newCol.save( function(err, col) {
    console.log(col);
    Module.findByIdAndUpdate(req.params.id, {$push : {collections: { _id: col._id}}}, function(err) {
      res.send('success');
    });
  });
});

/* GET module collection fields. */
router.get('/module/collection/fields/:id/:collection', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all modules
    modules: function(callback) {
      Module.find({})
      .populate('_state')
      .populate('collections')      
      .exec(callback);
    },
    module: function(callback) {
      Module.findById(req.params.id)
      .populate("collections._col")
      .exec(callback);
    },
    col: function(callback) {
      Col.findById(req.params.collection)
      .populate("col.fields._field")
      .exec(callback);
    },
    fields: function(callback) {
      Field.find({_collection: req.params.collection})
      .populate("_type")
      .exec(callback);
    },
    types: function(callback) {
      FieldType.find({})
      .exec(callback);
    }

  }, function(err, results) {
    if(err) {
      //console.log(err);
    } else {
      console.log(results)
      res.render('administration/module-collection-fields', { title: 'Express', user: req.user, modules: results.modules, module: results.module, types: results.types, col: results.col, fields: results.fields });
    }
    
  });
});

router.post('/modules/collection/fields/create/:id', function(req, res, next) {
  var newField = new Field(req.body);
  async.parallel({
    create: function(callback) {
      newField.save(callback);
    },
  }, function(err, results) {
      if(err) { console.log(err); }
      console.log(results.create[0]);
      //f_id = new mongoose.Types.ObjectId(results.create._id);
      var f_id = results.create[0]._id;
      Col.findByIdAndUpdate(req.params.id, {$push: {fields: { _id : f_id}}}, function(err) {
        if(err) {
          console.log(err);
          res.send('error');
        } else {
          res.send('success');
        }
      });
  });
});

// create module
router.post('/modules/create', function(req, res, next) {
  var newModule = new Module(req.body);
  console.log(req.body);
  newModule.save( function(err) {
    if(err) {
      res.send(err);
    } else {
      res.send('success');
    }
  })
});

router.post('/modules/update/:id', function(req, res, next) {
  Module.findOneAndUpdate(req.params.id, req.body, function(err) {
    if(err) {
      res.send('error');
    } else {
      res.send('success');
    }
  });
});


/* GET instance_settings listing. */
router.get('/instance_settings', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all modules
    modules: function(callback) {
      Module.find({})
      .exec(callback);
    },
    settings: function(callback) {
      InstanceSetting.find({}).exec(callback);
    }

  }, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      res.render('administration/instance_settings', { title: 'Express', user: req.user, modules: results.modules, settings: results.settings });
    }
    
  });
});

/* GET ONE instance_settings listing. */
router.get('/instance_settings/edit/:id', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all modules
    modules: function(callback) {
      Module.find({})
      .exec(callback);
    },
    settings: function(callback) {
      InstanceSetting.find({}).exec(callback);
    },
    setting: function(callback) {
      InstanceSetting.findById(req.params.id).exec(callback);
    }

  }, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      res.render('administration/edit-instance_setting', { title: 'Express', user: req.user, modules: results.modules, settings: results.settings, setting: results.setting });
    }
    
  });
});


/* POST Instance_Settings. */
router.post('/instance_settings/edit/:id', function(req, res, next) {
  if(!req.user) {
    res.redirect('/auth/logout');
  }
  async.parallel({

    //get all modules
    modules: function(callback) {
      Module.find({})
      .exec(callback);
    },
    settings: function(callback) {
      InstanceSetting.find({}).exec(callback);
    },
    setting: function(callback) {
      InstanceSetting.findById(req.params.id).exec(callback);
    },
    update: function(callback) {
      InstanceSetting.findByIdAndUpdate(req.params.id, req.body)
      .exec(callback);
    }

  }, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      res.send('success');
    }
    
  });
});



module.exports = router;