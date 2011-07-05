$(function(){
   window.GlyphModel = Backbone.Model.extend({
     initialize: function() {
       this.set({"encoding": 8 });
       this.set({"width": 8 });
       this.set({"height": 8 });
       this.set({"bitmap": [] });
     },
     
     // Remove this Todo from localStorage and delete its view.
     clear: function() {
        this.destroy();
        this.view.remove();
      }
   });
   
   window.GlyphList = Backbone.Collection.extend({
     
     model: GlyphModel
     
   });
  
   window.Glyphs = new GlyphList;
   
   window.GlyphView = Backbone.View.extend({
     
     tagName : "li",
     
     template: _.template($('#item-template').html()),
   });
      
   window.AppView = Backbone.View.extend({});
   window.App = new AppView;
});