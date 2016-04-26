var chai = require("chai");
var chaiHttp = require("chai-http");

global.enviornment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

var seededData;

describe('Shopping List', function() {
   before(function(done) {
       seed.run(function() {
           done();
       });
   });
   
   after(function(done) {
       Item.remove(function() {
          done(); 
       });
   });
   
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function (err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0]._id.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                seededData = res.body;
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name':'Kale'})
            .end(function (err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Kale');
                
                done();
            });
    });
    it('should edit an item on PUT', function(done) {
        chai.request(app)
            .put('/items/'+seededData[0]._id)
            .send({name: 'Onions', _id: seededData[0]._id})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Onions');
                
                done();
            });
    });
    it('should add an item on POST when _id does not exist', function(done) {
        chai.request(app)
            .put('/items/10')
            .send({name: 'Sausages', _id: 10})
            .end(function(err, res) {
                should.equal(err, null);
                
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Sausages');
                
                done();
            });
    });
    it('should delete an item on DELETE', function(done) {
        chai.request(app)
            .delete('/items/'+seededData[0]._id)
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Onions');
                
                done();
            });
    });
    it('should fail gracefully when an incorrect _id is given to DELETE', function(done) {
        chai.request(app)
            .delete('/items/100')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('no item with that _id');
                
                done();
            });
    });
});