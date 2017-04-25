riot.tag2('sep-form', '<form onsubmit="{noop}" onreset="{noop}" ref="form"><yield></yield></form>', '', '', function(opts) {
        this.freshData = () => ({ });
        this.addTo = (property, value) => {
            return () => this.data[property].push(value || {});
        };
        this.removeFrom = (property) => {
            return ((event) => {
                this.data[property].splice(event.item.index, 1);
                this.update();
            });
        };
        this.fileUploaded = (event) => {
            event.preventUpdate = true;
            var localFile = event.target.files[0];
            var reader = new FileReader();
            reader.onload = (read) => {
                var data = JSON.parse(read.target.result);
                data.filename = localFile.name;
                this.setData(data);
                this.update();
            };
            reader.readAsText(localFile);
            event.target.value = null;
        };
        this.serialize = () => {
            return $(this.refs.form).find('input, select')
                .serializeJSON({
                    useIntKeysAsArrayIndex: true,
                    customTypes: {
                        number: (strValue) => { return strValue == "" ? null : Number(strValue); }
                    }
                });
        };
        this.validate = (event) => {
            event.preventUpdate = true;
            this.removeValidations();
            this.revalidate = "Revalidate";
            $.ajax({
                type: "POST",
                url: this.opts.validationUrl,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(this.serialize()),
                success: this.processValidationResponse
            });
        };
        this.downloadFile = () => {
            event.preventUpdate = true;
            event.preventDefault();
            var data = this.serialize();
            var filename = data.filename || "my";
            if (!filename.toLowerCase().endsWith(".json")) {
                filename += ".json";
            }
            delete data.filename;
            this.downloadData(data, filename);
            return false;
        };
        this.downloadData = (data, filename) => {
            var blob = new Blob([JSON.stringify(data, null, "\t")]);
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            }
        };
        this.setData = (data) => {
            this.data = Object.assign(this.freshData(), data || {});
            this.removeValidations();
        };
        this.removeValidations = () => {
            $("sep-validation").each((i, el) => el._tag.reset());
            $(".form-group").removeClass("has-error");
            $(".panel").removeClass("panel-danger");
            delete this.result;
            delete this.revalidate;
        };
        this.dismiss = () => (this.dismissed = true);
        this.reset = () => this.setData();
        this.processValidationResponse = (response) => {
            if (!response.isSuccess) {
                $.each(Object.keys(response.errorsByKey), (index, key) => {
                    var errorMessages = response.errorsByKey[key];
                    var validationWidgets = $("sep-validation[key='" + key + "'], sep-validation[key^='" + key + ":']");
                    if (validationWidgets.length) {
                        validationWidgets.closest(".form-group").addClass("has-error");
                        validationWidgets.closest(".panel").addClass("panel-danger");
                        validationWidgets.each((i, el) => el._tag.setMessages(errorMessages));
                    } else {
                        alert("validation messages not handled for key: " + key);
                    }
                });
                this.setResult("There are some problems.", false);
            } else {
                this.removeValidations();
                this.setResult("Everything looks good.", true);
            }
            this.update();
        };
        this.scrollToFirstValidationError = (e) => {
            e.preventDefault();
            e.preventUpdate = true;
            $('html, body').animate({
                scrollTop: $(".panel-danger").offset().top - $(".sticky").outerHeight() - 30
            }, 750);
            return false;
        };
        this.setResult = (message, isSuccess) => {
            this.result = {
                message: message,
                success: isSuccess
            };
            delete this.dismissed;
        };
        this.on("before-mount", () => {
            this.data = this.freshData();
        });
        this.on("mount", () => {
            $(this.refs.form).find(".alert").alert();
        });
        this.noop = (e) => {
          e.preventDefault();
          e.preventUpdate = true;
          return false;
        }
});

riot.tag2('sep-panel', '<div class="{panelClasses()}"><div class="panel-heading" if="{opts.header}"><div class="panel-title">{opts.header}</div></div><div class="panel-body"><yield></yield></div></div>', 'sep-panel .panel-heading,[data-is="sep-panel"] .panel-heading{ height: 44px; } sep-panel .panel-title,[data-is="sep-panel"] .panel-title{ display: inline-block; height: 100%; vertical-align: middle; } sep-panel .panel-icon,[data-is="sep-panel"] .panel-icon{ display: none; margin-right: 10px; } sep-panel .panel-danger .panel-icon,[data-is="sep-panel"] .panel-danger .panel-icon{ display: inline-block; height: 100%; vertical-align: middle; } sep-panel .panel-primary > .panel-heading,[data-is="sep-panel"] .panel-primary > .panel-heading{ font-weight: 600; } sep-panel .panel-body > button,[data-is="sep-panel"] .panel-body > button{ margin-bottom: 15px; } sep-panel .panel.sticky,[data-is="sep-panel"] .panel.sticky{ position: fixed; right: 30px; top: 15px; z-index: 1000; border: #bbbbbb solid 2px; } sep-panel .panel.first-on-page,[data-is="sep-panel"] .panel.first-on-page{ margin-top: 21px; } sep-panel .alert,[data-is="sep-panel"] .alert{ margin-top: 21px; margin-bottom: 0; max-width: 275px; } sep-panel .alert .alert-link,[data-is="sep-panel"] .alert .alert-link{ text-decoration: none; } sep-panel .alert .alert-link:hover,[data-is="sep-panel"] .alert .alert-link:hover{ text-decoration: underline; }', '', function(opts) {
        this.panelClasses = () => "panel " + (this.opts.panelClasses || "panel-default");
});

riot.tag2('sep-select', '<div class="form-group"><label for="{opts.uid}"> {opts.label} </label><select ref="select" class="selectpicker" id="{opts.uid}" name="{opts.key}" multiple="{opts.multiple}"><option each="{option in opts.options}" riot-value="{option[parent.opts.key_property]}" selected="{parent.isSelected(option)}"> {option[parent.opts.value_property]} ( {option[parent.opts.key_property]} ) </option></select><sep-validation key="{validationKey()}" class="validation-for-single-field" label="This"></sep-validation></div>', 'sep-select select,[data-is="sep-select"] select{ width: 100%; } sep-select label,[data-is="sep-select"] label{ margin-bottom: 0; } sep-select .has-error .bootstrap-select .dropdown-toggle,[data-is="sep-select"] .has-error .bootstrap-select .dropdown-toggle{ border-width: 3px; } sep-select:last-child .form-group { margin: 0; }', '', function(opts) {
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

riot.tag2('sep-text-input', '<div class="form-group" title="{opts.helpText}"><label for="{opts.uid}" class="control-label"> {opts.label} </label><input type="text" id="{opts.uid}" name="{opts.key}" riot-value="{opts.riotValue}" maxlength="{opts.maxlength}" class="form-control"><div class="help-text" for="{opts.uid}"></div><sep-validation key="{opts.key}" class="validation-for-single-field" label="This"></sep-validation></div>', 'sep-text-input input,[data-is="sep-text-input"] input{ width: 100%; } sep-text-input label,[data-is="sep-text-input"] label{ margin-bottom: 0; } sep-text-input .has-error .form-control,[data-is="sep-text-input"] .has-error .form-control{ border-width: 3px; } sep-text-input:last-child .form-group { margin: 0; } sep-text-input .tooltip,[data-is="sep-text-input"] .tooltip,sep-text-input .tooltip.bottom,[data-is="sep-text-input"] .tooltip.bottom{ position: static !important; color: white; width: 100%; margin: 0; padding: 0; } sep-text-input .tooltip-arrow,[data-is="sep-text-input"] .tooltip-arrow{ display: none; } sep-text-input .tooltip-inner,[data-is="sep-text-input"] .tooltip-inner{ background-color: #272B30; max-width: 100%; text-align: left; }', '', function(opts) {
        this.on('before-mount', () => {
            this.opts.uid = Math.random().toString(16).slice(2);
        });
        this.on('mount', () => {
            if (this.opts.helpText) {
                $(this.root).find("div").tooltip({
                    animation: false,
                    container: ".help-text[for='" + this.opts.uid + "']",
                    html: true,
                    placement: 'bottom',
                    trigger: 'focus'
                });
            }
        });
});

riot.tag2('sep-validation', '<ul if="{messages.length}" class="text-danger field-validation-error" data-valmsg-for="{opts.key}"><li each="{message in messages}"> {parent.opts.label}{message}. </li></ul>', 'sep-validation ul,[data-is="sep-validation"] ul{ list-style: none; padding: 0; margin-top: 0px; margin-bottom: 10px; margin-left: 13px; margin-right: 0; font-size: 16px; } sep-validation.validation-for-single-field ul { margin: 0; font-size: 14px; }', '', function(opts) {
        this.messages = [];
        this.setMessages = (messages) => {
            this.messages = messages;
            this.update();
        };
        this.reset = () => this.setMessages([]);
});
