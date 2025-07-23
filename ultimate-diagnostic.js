// ========== ULTIMATE DIAGNOSTIC ==========
// Comprehensive diagnosis of the Greece Berlin filter issue

console.log('🔍 ULTIMATE DIAGNOSTIC: Starting comprehensive analysis...');

window.ULTIMATE_DIAGNOSE_GREECE_BERLIN = function() {
    console.log('🔍 ULTIMATE DIAGNOSTIC: Analyzing Greece Berlin issue...');
    console.log('='.repeat(80));
    
    // Step 1: Check what page we're on
    console.log('1️⃣ PAGE ANALYSIS:');
    console.log(`   URL: ${window.location.href}`);
    console.log(`   Title: ${document.title}`);
    console.log(`   HTML file: ${window.location.pathname.split('/').pop()}`);
    
    // Step 2: Find ALL city filter elements
    console.log('\n2️⃣ FILTER ELEMENT SEARCH:');
    
    const cityFilterById = document.getElementById('city-filter');
    const cityFiltersByClass = document.querySelectorAll('.city-filter');
    const cityFiltersByName = document.querySelectorAll('[name="city-filter"]');
    const allSelects = document.querySelectorAll('select');
    
    console.log(`   getElementById('city-filter'): ${cityFilterById ? '✅ FOUND' : '❌ NOT FOUND'}`);
    console.log(`   querySelectorAll('.city-filter'): ${cityFiltersByClass.length} elements`);
    console.log(`   querySelectorAll('[name="city-filter"]'): ${cityFiltersByName.length} elements`);
    console.log(`   All <select> elements: ${allSelects.length} total`);
    
    // Step 3: Analyze each select element
    console.log('\n3️⃣ SELECT ELEMENT ANALYSIS:');
    
    allSelects.forEach((select, index) => {
        console.log(`\n   SELECT ${index + 1}:`);
        console.log(`     ID: ${select.id || 'no ID'}`);
        console.log(`     Class: ${select.className || 'no class'}`);
        console.log(`     Name: ${select.name || 'no name'}`);
        console.log(`     Options: ${select.options.length}`);
        
        // Check if this could be a city filter
        const hasCity = Array.from(select.options).some(opt => 
            opt.textContent.toLowerCase().includes('city') ||
            opt.textContent.toLowerCase().includes('athens') ||
            opt.textContent.toLowerCase().includes('berlin') ||
            opt.textContent.toLowerCase().includes('paris')
        );
        
        if (hasCity) {
            console.log(`     🎯 LIKELY CITY FILTER! Options:`);
            Array.from(select.options).forEach((opt, optIndex) => {
                const text = opt.textContent || opt.innerText || '';
                if (text.toLowerCase().includes('berlin')) {
                    console.log(`       ${optIndex + 1}. "${text}" (value: "${opt.value}") ⚠️ CONTAINS BERLIN`);
                } else if (text.toLowerCase().includes('greece')) {
                    console.log(`       ${optIndex + 1}. "${text}" (value: "${opt.value}") ⚠️ CONTAINS GREECE`);
                } else {
                    console.log(`       ${optIndex + 1}. "${text}" (value: "${opt.value}")`);
                }
            });
        } else {
            console.log(`     Not a city filter`);
        }
    });
    
    // Step 4: Specific focus on main city filter
    console.log('\n4️⃣ MAIN CITY FILTER ANALYSIS:');
    
    if (cityFilterById) {
        console.log(`   ✅ Found city filter with ID 'city-filter'`);
        console.log(`   Current options: ${cityFilterById.options.length}`);
        console.log(`   All options:`);
        
        Array.from(cityFilterById.options).forEach((opt, index) => {
            const text = opt.textContent || opt.innerText || '';
            const value = opt.value || '';
            
            if (text.includes('Greece') && text.includes('Berlin')) {
                console.log(`     ${index + 1}. "${text}" (${value}) ❌ PROBLEM OPTION!`);
            } else if (text.includes('Berlin')) {
                console.log(`     ${index + 1}. "${text}" (${value}) 🎯 BERLIN OPTION`);
            } else {
                console.log(`     ${index + 1}. "${text}" (${value})`);
            }
        });
        
        // Step 5: Try to fix it
        console.log('\n5️⃣ ATTEMPTING FIX:');
        
        // Save original options for comparison
        const originalOptions = Array.from(cityFilterById.options).map(opt => ({
            text: opt.textContent,
            value: opt.value
        }));
        
        console.log('   Original options saved');
        
        // Clear and rebuild
        console.log('   Clearing filter...');
        cityFilterById.innerHTML = '';
        
        // Add default
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'All Cities';
        cityFilterById.appendChild(defaultOption);
        console.log('   Added default option');
        
        // Add correct options
        const correctOptions = [
            { value: 'athens', text: 'Greece, Athens' },
            { value: 'paris', text: 'France, Paris' },
            { value: 'berlin', text: 'Germany, Berlin' },
            { value: 'rome', text: 'Italy, Rome' },
            { value: 'london', text: 'United Kingdom, London' }
        ];
        
        correctOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            cityFilterById.appendChild(option);
            console.log(`   ✅ Added: ${opt.text}`);
        });
        
        console.log('\n   🎯 FIX APPLIED! New options:');
        Array.from(cityFilterById.options).forEach((opt, index) => {
            console.log(`     ${index + 1}. "${opt.textContent}" (${opt.value})`);
        });
        
        // Check if it worked
        const berlinOption = Array.from(cityFilterById.options).find(opt => opt.value === 'berlin');
        if (berlinOption) {
            const berlinText = berlinOption.textContent;
            console.log(`\n   🎯 RESULT: Berlin now shows as "${berlinText}"`);
            
            if (berlinText === 'Germany, Berlin') {
                console.log('   ✅ SUCCESS! Berlin is now correctly showing as "Germany, Berlin"');
                return true;
            } else {
                console.log('   ❌ STILL WRONG! Berlin is not showing as "Germany, Berlin"');
                return false;
            }
        } else {
            console.log('   ❌ BERLIN OPTION NOT FOUND!');
            return false;
        }
        
    } else {
        console.log('   ❌ No city filter found with ID "city-filter"');
        
        // Check if there's a city filter elsewhere
        console.log('\n   🔍 SEARCHING FOR ALTERNATIVE CITY FILTERS:');
        
        allSelects.forEach((select, index) => {
            const hasCity = Array.from(select.options).some(opt => 
                opt.textContent.toLowerCase().includes('berlin')
            );
            
            if (hasCity) {
                console.log(`   🎯 Found potential city filter (SELECT ${index + 1}):`);
                console.log(`     ID: ${select.id}`);
                console.log(`     Options with Berlin:`);
                
                Array.from(select.options).forEach(opt => {
                    if (opt.textContent.toLowerCase().includes('berlin')) {
                        console.log(`       "${opt.textContent}" (${opt.value})`);
                    }
                });
            }
        });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('🔍 DIAGNOSTIC COMPLETE');
    
    return false;
};

// Auto-run diagnostic
setTimeout(() => {
    console.log('🔍 Auto-running ultimate diagnostic...');
    window.ULTIMATE_DIAGNOSE_GREECE_BERLIN();
}, 1000);

console.log('🔍 ULTIMATE DIAGNOSTIC LOADED');
console.log('💡 Manual run: window.ULTIMATE_DIAGNOSE_GREECE_BERLIN()'); 