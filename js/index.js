const string = document.querySelector( "#string" );
const key =  document.querySelector( "#key" );
const encryptedString  = document.querySelector( "#encryptedString" );
const btnEncrypt  = document.querySelector( "#btn-encrypt" );
const btnDecrypt = document.querySelector( "#btn-decrypt" );

btnEncrypt.addEventListener( 'click', (e) => {
    e.preventDefault();
    encryptedString.value = encrypt( key.value, string.value.toLowerCase() );
    string.value = "";
    e.target.blur();
});

btnDecrypt.addEventListener( 'click', (e) => {
    e.preventDefault();
    string.value = decrypt( key.value, encryptedString.value.toLowerCase() );
    encryptedString.value = "";
    e.target.blur();
});

function isAlpha( ch ) {
    return /^[A-Z]$/i.test(ch);
} 

function generateVSquare() {
    const vSquare = [];

    function shiftAlphabets( shift ) {
        const alphabets = [..."abcdefghijklmnopqrstuvwxyz"];

        for ( i=1; i<=shift; i++ ) {
            alphabets.push( alphabets.shift() );
        }
        return alphabets
    }

    for( j=0; j<26; j++ ) {
        vSquare[j] = shiftAlphabets( j );
    }

    return vSquare
}

function generateKeyStream( key, string  ) {
    while( key.length <= string.replace( /\s/g, "" ).length ) {
        key+=key;
    }

    key = Array.from( key );

    for ( i in string ) {
        if( !isAlpha( string[i] ) ) {
            key.splice( i, 0, string[i] );
        }
    }

    const keystream = key.slice( 0, string.length );

    return keystream
}

function encrypt( key, string ) {
    const vSquare = generateVSquare();
    const keystream = generateKeyStream( key, string );
    
    let encryptedString = [];

    for( i=0; i<string.length; i++ ) {
        if( isAlpha(keystream[i]) ) {
            encryptedString[i] = vSquare[keystream[i].charCodeAt()-97][string[i].charCodeAt()-97];
        } 
        else {
            encryptedString[i] = keystream[i]
        }
    }
    
    encryptedString = encryptedString.join( "" );
    return encryptedString
}

function decrypt( key, string ) {
    const vSquare = generateVSquare();
    const keystream = generateKeyStream( key, string );

    let decryptedString = [];

    for( i=0; i<string.length; i++ ) {
        if( isAlpha( keystream[i] ) ) {
            j=0;
            while( vSquare[keystream[i].charCodeAt()-97][j] != string[i] ) {
                j++;
            }
            
            decryptedString[i] = String.fromCharCode(j+97);
        }
        else {
            decryptedString[i] = keystream[i]
        }
    }

    decryptedString = decryptedString.join( "" );
    return decryptedString
}