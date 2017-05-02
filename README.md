# sep-validate-riot
[riot](http://riotjs.com/) tags for json web forms with validation and help text

## Usage ##

Use [git](https://git-scm.com/) to clone this package, or require it via [bower](https://bower.io/). Then, in an appropriate place in your web application (like the head), include the following line:


    <script src="./js/sep-validate-riot.js" type="text/javascript"><script>

Since this is a set of riot tags, you will need to mount them in order to use them. You should mount the outermost tag, whether it is one of your tags or one of the tags from this library, it doesn't matter. This might look something like this:

    <script type="text/javascript">
      riot.mount("sep-form");
    <script>

## Tags ##

Here are some tags you can use:

  - [sep-panel](#sep-panel)
  - [sep-alert](#sep-alert)
  - [sep-form](#sep-form)
  - [sep-text-input](#sep-text-input)
  - [sep-select](#sep-select)
  - [sep-validation](#sep-validation)

### <a name="sep-panel"></a>sep-panel ##

A pithier bootstrap panel

|Attribute|Description|
|---------|-----------|
|**header**|The title of the panel. If falsy, the panel will not have a header. Use `" "` for an apparently empty header.|
|*[innerHTML]*|The html inside of an &lt;sep-panel&gt; tag will appear inside the body of the panel.|

This panel's header will indicate if there are validation errors in its body.

### <a name="sep-alert"></a>sep-alert ##

A pithier bootstrap alert

|Attribute|Description|
|---------|-----------|
|**alert-classes**|A set of classes to be applied to the alert in addition to the `alert` class (e.g. `alert-danger`). If none is specified, defaults to `alert-info`|
|**dismissable**|If omitted or truthy, the alert will be include an X to dismiss the alert.|
|*[innerHTML]*|The html inside of an &lt;sep-alert&gt; tag will appear inside the body of the alert.|

### <a name="sep-form"></a>sep-form ###

A web form with built-in support for serialization and validation

|Attribute|Description|
|---------|-----------|
|**initial-value**|The value of a blank copy of the form. Defaults to the empty object.|
|**validation-messages**|A dictionary that maps keys to an array of error messages for the field indicated by the key. (e.g. a JSON representation of the `ErrorsByKey` property of a [ValidationStatus](https://github.com/sep/SEPValidationEngine/blob/master/ValidationEngine/ValidationStatus.cs))|
|*[innerHTML]*|The html inside of an &lt;sep-form&gt; tag will appear inside the body of the form.|

This tag also has several helper methods:

|Function|Description|
|---------|-----------|
|`addTo(property, value)`|A functor that returns an event handler that adds the given value to the collection indicated by the given property name.|
|`removeFrom(property)`|A functor that returns an event handler that removes an item from the collection indicated by the given property name. The item removed will be indicated by the `item.index` property of the event.|
|`serialize(serializeJsonOptions)`|Returns a JSON representation of the data in the form. `serializeJsonOptions` is an optional  object that will be passed to the  [jquery.serializeJSON](https://github.com/marioizquierdo/jquery.serializeJSON) library. It defaults to the empty object.|
|`registerValidation(key, validationTag)`|Mostly for internal use. Registers an &lt;sep-validation&gt; tag with the form, since the validation messages on those tags must be set prior to a form's riot update in order for styling to apply properly.|
|`reset()`|Resets the state of the form to the `initial-value`.|

### <a name="sep-text-input"></a>sep-text-input ###

A text input with a label, help-text, and validation message area

|Attribute|Description|
|---------|-----------|
|**key**|**Required**. Indicates the name of the field. This should be a jquery.serializeJSON-compatible name, and may include a type annotation. (e.g. age:number)|
|**help-text**|Text to aid the user in filling out this field. Will appear under the field by default.|
|**label**|A user-readable name for the field. Will appear above the field.|
|**maxlength**|Limits the maximum length of input the user may enter into the field.|
|**value**|The value to set on the input on a riot update, an initial value. Should probably reference the `data` property on the form tag.|

### <a name="sep-select"></a>sep-select ###

A pithier bootstrap-select input, with a label, help-text, and validation message area

|Attribute|Description|
|---------|-----------|
|**key**|**Required**. Indicates the name of the field. This should be a jquery.serializeJSON-compatible name, and may include a type annotation. (e.g. age:number)|
|**key_property**|The name of the property on each `options` object that holds the key. Defaults to `"Key"`.|
|**help-text**|Text to aid the user in filling out this field. Will appear under the field by default.|
|**label**|A user-readable name for the field. Will appear above the field.|
|**multiple**|Set this to something truthy to enable multi-selection|
|**options**|**Required**. An array of key/value objects to use as the options for the select .|
|**select_picker_opts**|Pass-through for [bootstrap-select](https://github.com/silviomoreto/bootstrap-select) options|
|**value**|The value to set on the input on a riot update, an initial value. Should probably reference the `data` property on the form tag. Make sure this is an array if `multiple` is truthy.|
|**value_property**|The name of the property on each `options` object that holds the value. Defaults to `"Value"`.|

### <a name="sep-validation"></a>sep-validation ###

A display area for validation messages

|Attribute|Description|
|---------|-----------|
|**key**|**Required**. Indicates the name of the field. This should be a jquery.serializeJSON-compatible name omitting the type declaration, if any.|
|**label**|A prefix to prepend before each validation message.|

Set messages by assigning an array of strings to the tag's `messages` property.
