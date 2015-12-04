var apiClient = require('../../../api/client');
var putFile = require('../../../lib/put-file');

var projects = apiClient.type('projects');
var guides = apiClient.type('field_guides');

var DEFAULT_ITEM = {
  title: 'Untitled',
  content: 'Here’s everything you need to know about the great **Untitled**...'
};

var actions = {
  createGuide: function(projectID) {
    var defaultItem = Object.assign({}, DEFAULT_ITEM);
    var newGuide = {
      items: [defaultItem],
      language: 'en',
      links: {project: projectID}
    };
    return guides.create(newGuide).save();
  },

  deleteGuide: function(guideID) {
    return guides.get(guideID).then(function(guide) {
      return guide.delete();
    });
  },

  replaceItems: function(guideID, items) {
    return guides.get(guideID).then(function(guide) {
      guide.update({
        _busy: true,
        items: items
      });
      return guide.save();
    }).then(function(guide) {
      guide.update({
        _busy: false
      });
    });
  },

  updateItem: function(guideID, itemIndex, changes) {
    return guides.get(guideID).then(function(guide) {
      Object.assign(guide.items[itemIndex], changes);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then(function(guide) {
      guide.update({
        _busy: false
      });
      return guide;
    });
  },

  clearItemIcon: function(guideID, itemIndex) {},

  setItemIcon: function(guideID, itemIndex, iconFile) {
    return guides.get(guideID).then(function(guide) {
      guide.update({
        _busy: true
      });

      var attachedImagesURL = guide._getURL('attached_images');

      var payload = {
        media: {
          content_type: iconFile.type,
          metadata: {
            filename: iconFile.name
          }
        }
      };

      return apiClient.post(attachedImagesURL, payload).then(function(media) {
        media = [].concat(media)[0];
        return putFile(media.src, iconFile).then(function() {
          var changes = {}
          changes['items.' + itemIndex + '.icon'] = media.id;
          guide.update(changes);

          return guide.save().then(function() {
            guide.update({
              _busy: false
            });
            return guide;
          });
        });
      });
    });
  },

  appendItem: function(guideID) {
    var newItem = Object.assign({}, DEFAULT_ITEM);
    return guides.get(guideID).then(function(guide) {
      guide.items.push(newItem);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then(function(guide) {
      guide.update({
        _busy: false
      });
      return guide;
    });
  },

  removeItem: function(guideID, itemIndex) {
    return guides.get(guideID).then(function(guide) {
      guide.items.splice(itemIndex, 1);
      guide.update({
        _busy: true,
        items: guide.items
      });
      return guide.save();
    }).then(function(guide) {
      guide.update({
        _busy: false
      });
      return guide;
    });
  }
};

module.exports = actions;
