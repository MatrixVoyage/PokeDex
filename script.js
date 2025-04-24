const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };
  

  const pokemonInput = document.getElementById('pokemonInput');
  const dataContainer = document.getElementById('dataContainer');
  const loading = document.getElementById('loading');
  const terminalText = document.getElementById('terminalText');
  
 
  pokemonInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      fetchPokemon();
    }
  });
  

  function setTerminalMessage(message, type = 'info') {
    let color;
    switch(type) {
      case 'error': color = 'var(--error)'; break;
      case 'success': color = 'var(--success)'; break;
      case 'warning': color = 'var(--warning)'; break;
      default: color = 'var(--primary)';
    }
    
    terminalText.textContent = message;
    terminalText.style.color = color;
  }
  
  async function fetchPokemon() {
    const nameOrId = pokemonInput.value.trim().toLowerCase();
    if (!nameOrId) {
      setTerminalMessage('Error: No query specified', 'error');
      return;
    }
    
    
    loading.style.display = 'block';
    dataContainer.style.display = 'none';
    setTerminalMessage(`Fetching data for: ${nameOrId}...`);
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
      if (!response.ok) throw new Error('Pokémon not found in database');
      
      const data = await response.json();
      displayPokemon(data);
      setTerminalMessage(`Data retrieval complete. Displaying: ${data.name.toUpperCase()}`, 'success');
      
    } catch (error) {
      loading.style.display = 'none';
      setTerminalMessage(`Error: ${error.message}`, 'error');
    }
  }
  
  function displayPokemon(data) {
  
    document.getElementById('pokeName').textContent = data.name.toUpperCase();
    document.getElementById('pokeId').textContent = `#${data.id.toString().padStart(3, '0')}`;
    document.getElementById('pokeHeight').textContent = `${(data.height / 10).toFixed(1)}m`;
    document.getElementById('pokeWeight').textContent = `${(data.weight / 10).toFixed(1)}kg`;
    document.getElementById('pokeExp').textContent = data.base_experience;
    

    const imgUrl = data.sprites.other['official-artwork'].front_default || 
                   data.sprites.front_default;
    const imgElement = document.getElementById('pokeImg');
    imgElement.src = imgUrl;
    imgElement.classList.remove('loaded');
    
   
    const typesContainer = document.getElementById('pokeType');
    typesContainer.innerHTML = '';
    data.types.forEach(type => {
      const typeName = type.type.name;
      const badge = document.createElement('span');
      badge.className = 'type-badge';
      badge.textContent = typeName.toUpperCase();
      badge.style.borderLeftColor = typeColors[typeName] || '#777';
      typesContainer.appendChild(badge);
    });
    

    const abilitiesContainer = document.getElementById('pokeAbilities');
    abilitiesContainer.innerHTML = '';
    data.abilities.forEach((ability, index) => {
      if (index > 0) abilitiesContainer.appendChild(document.createTextNode(', '));
      const span = document.createElement('span');
      span.textContent = ability.ability.name.split('-').join(' ').toUpperCase();
      abilitiesContainer.appendChild(span);
    });
    

    const statsContainer = document.getElementById('pokeStats');
    statsContainer.innerHTML = '';
    data.stats.forEach(stat => {
      const statItem = document.createElement('div');
      statItem.className = 'stat-item';
      
      const statName = document.createElement('div');
      statName.className = 'stat-name';
      statName.innerHTML = `
        <span>${stat.stat.name.toUpperCase().split('-').join(' ')}</span>
        <span>${stat.base_stat}</span>
      `;
      
      const statBar = document.createElement('div');
      statBar.className = 'stat-bar';
      
      const statBarFill = document.createElement('div');
      statBarFill.className = 'stat-bar-fill';
      statBarFill.style.width = `${Math.min(100, stat.base_stat)}%`;
      
      statBar.appendChild(statBarFill);
      statItem.appendChild(statName);
      statItem.appendChild(statBar);
      statsContainer.appendChild(statItem);
    });
    
   
    const movesContainer = document.getElementById('pokeMoves');
    movesContainer.innerHTML = '';
    data.moves.slice(0, 20).forEach(move => {
      const moveItem = document.createElement('span');
      moveItem.className = 'move-item';
      moveItem.textContent = move.move.name.split('-').join(' ').toUpperCase();
      movesContainer.appendChild(moveItem);
    });
  
    loading.style.display = 'none';
    dataContainer.style.display = 'grid';
    setTimeout(() => {
      dataContainer.classList.add('visible');
    }, 50);
  }
  

  window.addEventListener('load', () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    pokemonInput.value = randomId;
    fetchPokemon();
  });
