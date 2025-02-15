/*
	ISC License

	Copyright (c) 2019, Pierre-Louis Despaigne

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted, provided that the above
	copyright notice and this permission notice appear in all copies.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

const multiC = require('multicodec');
const multiH = require('multihashes');

const { hexStringToBuffer, profiles } = require('./profiles');
const { cidForWeb, cidV0ToV1Base32 } = require('./helpers');

module.exports = {

	//export some helpers functions
	helpers: {
		cidForWeb,
		cidV0ToV1Base32,
	},

	/**
	* Decode a Content Hash.
	* @param {string} hash an hex string containing a content hash
	* @return {string} the decoded content
	*/
	decode: function (contentHash) {
		const buffer = hexStringToBuffer(contentHash);
		const codec = multiC.getCodec(buffer);
		const value = multiC.rmPrefix(buffer);
		let profile = profiles[codec];
		if (!profile) profile = profiles['default'];
		return profile.decode(value);
	},

	/**
	* Encode an IPFS address into a content hash
	* @param {string} ipfsHash string containing an IPFS address
	* @return {string} the resulting content hash
	*/
	fromIpfs: function (ipfsHash) {
		return this.encode('ipfs-ns', ipfsHash);
	},

	/**
	* Encode a Skylink into a content hash
	* @param {string} skylink string containing a Skylink
	* @return {string} the resulting content hash
	*/
	fromSkylink: function (skylink) {
		return this.encode('skynet-ns', skylink);
	},

	/**
	* Encode a Swarm address into a content hash
	* @param {string} swarmHash string containing a Swarm address
	* @return {string} the resulting content hash
	*/
	fromSwarm: function (swarmHash) {
		return this.encode('swarm-ns', swarmHash);
	},

    /**
	* Encode a arweave address into a content hash
	* @param {string} swarmHash string containing a arweave address
	* @return {string} the resulting content hash
	*/
    fromArweave: function(arweave) {
        return this.encode('arweave-ns', arweave);
    },

	/**
	* General purpose encoding function
  * @param {string} codec 
  * @param {string} value 
  */
	encode: function (codec_, value) {
		let codec = codec_;
		let profile = profiles[codec];
		if (!profile) profile = profiles['default'];
		const encodedValue = profile.encode(value);
		if (codec === 'ipns-dns') {
			codec = 'ipns-ns';
		}
		return multiH.toHexString(multiC.addPrefix(codec, encodedValue))
	},

	/**
	* Extract the codec of a content hash
	* @param {string} hash hex string containing a content hash
	* @return {string} the extracted codec
	*/
	getCodec: function (hash) {
		let buffer = hexStringToBuffer(hash);
		return multiC.getCodec(buffer);
	},
}
