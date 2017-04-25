# sep-validate-riot
riot tags for json web forms with validation and help text

## Usage ##

`throw "NotImplementedException"`

Soon, though:

    <script src="./js/sep-validate-riot.js"><script>

## Tags ##

Here are some tags you can use:

  - [sep-panel](#sep-panel)
  - [sep-form](#sep-form)
  - [sep-text-input](#sep-text-input)
  - [sep-select](#sep-select)
  - [sep-validation](#sep-validation)


### <a name="sep-panel"></a>sep-panel ##

A pithier bootstrap panel

    <sep-panel
      header="" // The title text for the panel, omit for no panel header
    >
      Put your panel's content here.
    </sep-panel>

### <a name="sep-form"></a>sep-form ###

A way to serialize and validate some JSON

    <sep-form
      validationUrl=""  // The url to post the form's content as JSON to recieve a [ValidationStatus](https://github.com/sep/SEPValidationEngine/blob/master/SepValidation/ValidationStatus.cs)
    >
      Put your form's content here.
    </sep-form>

### <a name="sep-text-input"></a>sep-text-input ###

A text input with a label, help-text, and validation

    <sep-input
      key=""        // Required, should be a [query.serializeJSON](https://github.com/marioizquierdo/jquery.serializeJSON) -compatible name
      value=""      // Required, should be the riotjs binding to your data object
      label=""      // The text for the control's label
      maxlength=""  // The maximum input length
      help-text=""  // The help text for this field
    />

### <a name="sep-select"></a>sep-select ###

A pithier bootstrap-select input, with a label

    <sep-select
      key=""                // Required, should be a [jquery.serializeJSON](https://github.com/marioizquierdo/jquery.serializeJSON)-compatible name
      value=""              // Required, should be the riotjs binding to your data object (use an array if multiple is truthy)
      options=""            // Required, should be an array of objects containing the key/value pairs for each option
      multiple=""           // Set this to something truthy to enable multi-selection
      label=""              // The text for the control's label
      key_property=""       // The name of the key property on the objects in `options`
      value_property=""     // The name of the value property on the objects in `options`
      select_picker_opts="" // Pass-through for [bootstrap-select](https://github.com/silviomoreto/bootstrap-select) options
    />

### <a name="sep-validation"></a>sep-validation ###

A display area for validation messages

    <sep-validation
      key=""        // Required. This should be a [jquery.serializeJSON](https://github.com/marioizquierdo/jquery.serializeJSON)-compatible name
      label=""      // The prefix for each validation message
    />

Set messages using the tag's `setMessages` method, which takes an array of strings.
