//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/** 
 * Creates a new Requests object.
 * 
 * @constructor
 * @extends rune.resource.Requests
 * 
 * @class
 * @classdesc
 * 
 * This class includes (bakes) resource files used by the application. A 
 * resource file is made available by reference (URI) or base64-encoded string. 
 * Tip: Use Rune-tools to easily bake resource files into this class.
 */
cloud_hop.data.Requests = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Extend rune.resource.Requests
     */
    rune.resource.Requests.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

cloud_hop.data.Requests.prototype = Object.create(rune.resource.Requests.prototype);
cloud_hop.data.Requests.prototype.constructor = cloud_hop.data.Requests;

//------------------------------------------------------------------------------
// Override protected prototype methods
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
cloud_hop.data.Requests.prototype.m_construct = function() {
    rune.resource.Requests.prototype.m_construct.call(this);
    this.add("cloud_dangerous", "./../asset/img/cloud_dangerous.png");
	this.add("cloud_neutral", "./../asset/img/cloud_neutral.png");
	this.add("heart", "./../asset/img/heart.png");
	this.add("lollipopv1", "./../asset/img/lollipopv1.png");
	this.add("pink_frog", "./../asset/img/pink_frog.png");
	this.add("renthy", "./../asset/img/renthy.png");
	this.add("electric_shock", "./../asset/wav/character_effects/electric_shock.wav");
	this.add("jump_chant_far", "./../asset/wav/character_effects/jump_chant_far.wav");
	this.add("jump_chant_medium", "./../asset/wav/character_effects/jump_chant_medium.wav");
	this.add("LIFE_UP", "./../asset/wav/character_effects/LIFE_UP.wav");
	this.add("mainmenu_music_intro", "./../asset/wav/mainmenu_music_intro.wav");
	this.add("mainmenu_v2", "./../asset/wav/mainmenu_v2.wav");
};