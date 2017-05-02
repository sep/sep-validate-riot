riot.tag2('sep-alert', '<div class="{alertClasses()}"> <span class="close" onclick="{dismiss}" if="{dismissable()}"> &times; </span> <yield></yield> </div>', '', '', function(opts) {
        this.alertClasses = () => {
            return "alert "
                + ((this.dismissable() && this.dismissed) ? "hidden " : "")
                + (this.opts.alertClasses || "alert-info");
        };
        this.dismissable = () => {
            return !this.opts.hasOwnProperty("dismissable")
                || this.opts.dismissable;
        };
        this.dismiss = () => (this.dismissed = true);
});

riot.tag2('sep-form', '<form ref="form"> <yield></yield> </form>', '', '', function(opts) {
    this.validationTags = {};
    this.addTo = (property, value) => {
      return (event) => {
        event.preventUpdate = true;
        this.data[property].push(value || {})
        this.update();
      };
    };
    this.removeFrom = (property) => {
      return (event) => {
        event.preventUpdate = true;
        this.data[property].splice(event.item.index, 1);
        this.update();
      }
    };
    this.serialize = (serializeJsonOptions) => {
      return $('input, select', this.root).serializeJSON(serializeJsonOptions || {});
    };
    this.registerValidation = (key, validationTag) => {
      this.validationTags[key] = validationTag;
    }
    this.reset = () => {
      if (this.refs.form) {
        this.refs.form.reset();
      }
      this.data = (this.opts.initialValue || {});
    };
    this.on("before-mount", this.reset);
    this.on("update", () => {
      $.each(this.validationTags, (key, validationTag) => {
        validationTag.messages = (this.opts.validationMessages || {})[key] || [];
      });
    });
});

riot.tag2('sep-panel', '<div ref="panel" class="{panelClasses()}"> <div class="panel-heading" if="{opts.header}"> <img class="panel-icon" src="/images/error-icon.svg"> <div class="panel-title">{opts.header}</div> </div> <div class="panel-body"> <yield></yield> </div> </div>', 'sep-panel .panel-heading,[data-is="sep-panel"] .panel-heading{ height: 44px; } sep-panel .panel-title,[data-is="sep-panel"] .panel-title{ display: inline-block; height: 100%; vertical-align: middle; } sep-panel .panel-icon,[data-is="sep-panel"] .panel-icon{ display: none; margin-right: 10px; } sep-panel .panel-danger .panel-icon,[data-is="sep-panel"] .panel-danger .panel-icon{ display: inline-block; height: 100%; vertical-align: middle; } sep-panel .panel-body > button,[data-is="sep-panel"] .panel-body > button{ margin-bottom: 15px; }', '', function(opts) {
    this.panelClasses = () => {
      return "panel " + (this.opts.panelClasses || "panel-default");
    };
});

riot.tag2('sep-select', '<div class="form-group"> <label for="{opts.uid}"> {opts.label} </label> <select ref="select" class="selectpicker" id="{opts.uid}" name="{opts.key}" multiple="{opts.multiple}"> <option each="{option in opts.options}" riot-value="{option[parent.opts.key_property]}" selected="{parent.isSelected(option)}"> {option[parent.opts.value_property]} ( {option[parent.opts.key_property]} ) </option> </select> <sep-validation key="{validationKey()}" class="validation-for-single-field" label="This"></sep-validation> </div>', 'sep-select select,[data-is="sep-select"] select{ width: 100%; } sep-select label,[data-is="sep-select"] label{ margin-bottom: 0; } sep-select .has-error .bootstrap-select .dropdown-toggle,[data-is="sep-select"] .has-error .bootstrap-select .dropdown-toggle{ border-width: 3px; } sep-select:last-child .form-group { margin: 0; }', '', function(opts) {
        this.validationKey = () => {
            return this.opts.key.endsWith("[]")
                ? this.opts.key.slice(0, this.opts.key.length - 2)
                : this.opts.key;
        };
        this.isSelected = (option) => {
            var val = option[this.opts.key_property];
            return $.isArray(this.opts.value)
                ? this.opts.value.includes(val)
                : this.opts.value == val;
        };
        this.syncValue = () => {
            this.opts.value = this.opts.riotValue || (this.opts.multiple ? [] : '');
        };
        this.on('before-mount', () => {
            this.opts.uid = Math.random().toString(16).slice(2);
            this.opts.key_property = this.opts.key_property || "Key";
            this.opts.value_property = this.opts.value_property || "Value";
            this.syncValue();
        });
        this.on('mount', () => {
            $(this.refs.select).selectpicker(this.opts.select_picker_opts || {});
        });
        this.on('update', () => this.syncValue());
        this.on('updated', () => {
            $(this.refs.select).selectpicker('render');
        });
});

riot.tag2('sep-text-input', '<div ref="formGroup" class="{form-group: true,       has-error: !isValid()}" title="{opts.helpText}"> <label for="{uid}" class="control-label"> {opts.label} </label> <input type="text" id="{uid}" name="{opts.key}" riot-value="{opts.riotValue}" maxlength="{opts.maxlength}" class="form-control"> <div class="help-text" for="{uid}"></div> <sep-validation ref="validation" key="{opts.key.split(⁗:⁗)[0]}" label="This"></sep-validation> </div>', 'sep-text-input input,[data-is="sep-text-input"] input{ width: 100%; } sep-text-input label,[data-is="sep-text-input"] label{ margin-bottom: 0; } sep-text-input .has-error .form-control,[data-is="sep-text-input"] .has-error .form-control{ border-width: 3px; } sep-text-input:last-child .form-group { margin: 0; } sep-text-input .tooltip,[data-is="sep-text-input"] .tooltip,sep-text-input .tooltip.bottom,[data-is="sep-text-input"] .tooltip.bottom{ position: static !important; width: 100%; margin: 0; padding: 0; } sep-text-input .tooltip-arrow,[data-is="sep-text-input"] .tooltip-arrow{ display: none; } sep-text-input .tooltip-inner,[data-is="sep-text-input"] .tooltip-inner{ max-width: 100%; text-align: left; }', '', function(opts) {
    this.isValid = () => !this.refs.validation || this.refs.validation.isValid();
    this.on('before-mount', () => {
      this.uid = Math.random().toString(16).slice(2);
    });
    this.on('mount', () => {
      if (this.opts.helpText) {
        $(this.refs.formGroup).tooltip({
          animation: false,
          container: ".help-text[for='" + this.uid + "']",
          html: true,
          placement: 'bottom',
          trigger: 'focus'
        });
      }
    });
});

riot.tag2('sep-validation', '<ul if="{messages.length}" class="text-danger field-validation-error" data-valmsg-for="{opts.key}"> <li each="{message in messages}"> {parent.opts.label}{message} </li> </ul>', 'sep-validation ul,[data-is="sep-validation"] ul{ list-style: none; padding: 0; margin-top: 0px; margin-bottom: 10px; margin-left: 13px; margin-right: 0; font-size: 16px; }', '', function(opts) {
    this.messages = [];
    this.isValid = () => {
      return this.messages && !this.messages.length;
    }
    this.sepFormTag = () => {
      var parent = this.parent;
      while (parent) {
        if (parent.root.tagName.toLowerCase() == "sep-form")
          return parent;
        parent = parent.parent
      }
    }
    this.on("before-mount", () => {
      this.sepFormTag().registerValidation(this.opts.key.split(":")[0], this);
    });
});
