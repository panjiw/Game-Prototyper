/**
 * Represents an Action that one Actor can do to another.
 * Properties:
 *  - name: name of the action
 *  - description: description of the action
 *  - applicable: a function that takes 2 actors (self, other) and returns a bool
 *             based on whether this action can be done by self on other
 *  - act: a function that takes 2 actors (self, other) and returns a nothing
 *         but represents in code what this action does
 */

(function() {
  var Action = (function() {
    var Action = function(name, description) {
      this.name = name;
      this.description = description;
      this.applicable = function(self, other) { return false; };
      this.act = function(self, other) {};
    };

    Action.prototype.setApplicabilityChecker = function(checker) {
      this.applicable = function(self, other) {
        for (var i = 0; i < self.blacklist.length; i++) {
          if (other.passRequirement(self.blacklist[i])) {
            return false;
          }
        }
        return checker(self, other);
      };
    };

    Action.prototype.setAct = function(act) {
      this.act = act;
    };

    return Action;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = {
      Action: Action
    };
  else
    window.Action = Action;
})();