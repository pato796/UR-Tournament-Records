import './style.css'

let tournaments = JSON.parse(
  localStorage.getItem('tournaments') || '[]'
)
let scores = JSON.parse(
  localStorage.getItem('scores') || '[]'
)
let matches = JSON.parse(localStorage.getItem('matches') || '[]')
let characters = JSON.parse(
  localStorage.getItem('characters') || '[]'
)
const app = document.querySelector('#app')

app.innerHTML = `
  <header class="header">
    <div class="logo">🏆 UR Tournament Records</div>
    <span class="status">大会記録システム</span>
  </header>

  <main class="container">
    <section class="welcome">
      <p class="sub">MY HERO ULTRA RUMBLE</p>
      <h1>大会記録</h1>
      <p>大会結果・チーム順位・個人ランキングを管理しよう。</p>
    </section>

  <nav class="navigation">
  <button class="nav-btn active" data-page="home">ホーム</button>
  <button class="nav-btn" data-page="tournament">大会一覧</button>
  <button class="nav-btn" data-page="register">ポイント登録</button>
  <button class="nav-btn" data-page="ranking">大会別ランキング</button>
  <button class="nav-btn" data-page="overall">総合ランキング</button>
  <button class="nav-btn" data-page="team">チーム詳細</button>
  <button class="nav-btn" data-page="individual">👤 個人ランキング</button>
 <button class="nav-btn" data-page="matches">🎮 試合記録</button>
 <button class="nav-btn" data-page="characters">👤 キャラクター管理</button>
 <button class="nav-btn" data-page="character-stats">
  📊 キャラ分析
</button>
 <button class="nav-btn" data-page="settings">設定</button>
</nav>

    <section id="content"></section>
  </main>

  <footer>UR Tournament Records</footer>
`

const content = document.querySelector('#content')
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char])
}
function showHome() {
  content.innerHTML = `
    <h2>ダッシュボード</h2>

    <div class="cards">
      <div class="card">
        <p>登録大会数</p>
        <strong>${tournaments.length}</strong>
      </div>
    </div>

    <div class="panel">
      <h2>大会記録へようこそ！</h2>
      <p>大会一覧から新しい大会を登録できるよ！</p>
    </div>
  `
}

function showTournaments() {
  content.innerHTML = `
    <h2>🏆 大会一覧</h2>

    <div class="panel">
      <h3>新しい大会を登録</h3>

      <form id="tournament-form">
        <p>大会名</p>
        <input id="name" required placeholder="大会名">

        <p>開催日</p>
        <input id="date" type="date" required>

        <h3>参加チーム</h3>
        <div id="team-input-list"></div>

        <button type="button" id="add-team">
          ➕ チームを追加
        </button>

        <br><br>
        <h3>🏅 MVPの決め方</h3>
<select id="mvp-mode">
  <option value="points">① 個人ポイント制（自動）</option>
  <option value="manual">② 手動で選択</option>
  <option value="combined">③ 総合評価制（自動）</option>
</select>
        <button type="submit">大会を登録する</button>
      </form>
    </div>

    <h3>登録済み大会</h3>

    <div id="tournament-list">
      ${
        tournaments.length === 0
          ? '<p>まだ大会は登録されていません。</p>'
          : tournaments.map((t, i) => `
            <div class="panel">
              <h3>🏆 ${escapeHTML(t.name)}</h3>
              <p>開催日：${escapeHTML(t.date)}</p>

              <p>参加チーム：</p>
              ${
                t.teams?.length
                  ? t.teams.map(team => `
                    <p>・${escapeHTML(team.name)}</p>
                  `).join('')
                  : '<p>チーム未登録</p>'
              }

              <button class="point-setting-btn" data-index="${i}">
                ⚙️ ポイント設定
              </button>
<button class="mvp-btn" data-index="${i}">
  🏅 MVPを決める
</button>
              <button class="delete-btn" data-index="${i}">
                削除
              </button>
            </div>
          `).join('')
      }
    </div>
  `

  const teamList = document.querySelector('#team-input-list')

 
function addTeam() {
  const index = teamList.children.length

  const div = document.createElement('div')
  div.className = 'panel team-entry'

  div.innerHTML = `
    <h3>チーム ${index + 1}</h3>

    <p>チーム名</p>
    <input class="team-name" required placeholder="チーム名">

    <p>選手1</p>
    <input class="member-name" required placeholder="選手名">

    <p>選手2</p>
    <input class="member-name" required placeholder="選手名">

   <p>選手3</p>
<input class="member-name" required placeholder="選手名">

<p>選手4（補欠・任意）</p>
<input class="member-name" placeholder="補欠の選手名">

<button type="button" class="remove-team">
      🗑️ このチームを削除
    </button>
  `

  teamList.appendChild(div)
}
  // 最初のチームを自動で追加
  addTeam()

  // チーム追加ボタン
  document.querySelector('#add-team')
    .addEventListener('click', addTeam)

  // チーム削除ボタン
  teamList.addEventListener('click', event => {
    if (!event.target.classList.contains('remove-team')) return

    if (teamList.children.length <= 1) {
      alert('最低1チームは必要です。')
      return
    }

    event.target.closest('.team-entry').remove()

    Array.from(teamList.children).forEach((team, index) => {
      team.querySelector('h3').textContent = `チーム ${index + 1}`
    })
  })

  // 大会登録
  document.querySelector('#tournament-form')
    .addEventListener('submit', event => {
      event.preventDefault()

      const teams = Array.from(
        document.querySelectorAll('.team-entry')
      ).map(team => ({
        name: team.querySelector('.team-name').value.trim(),
        members: Array.from(
          team.querySelectorAll('.member-name')
        )
          .map(input => input.value.trim())
          .filter(Boolean)
      }))
      const tournament = {
        name: document.querySelector('#name').value.trim(),
        date: document.querySelector('#date').value,
        teams,
        mvpMode: document.querySelector('#mvp-mode').value,
        pointSettings: {
          killEnabled: true,
          killRate: 1,
          killMaxPoints: 10,

          damageEnabled: true,
          damageUnit: 3000,
          damageRate: 1,
          damageMaxPoints: 15,

          placementEnabled: true,
          placementPoints: {
            1: 8, 2: 7, 3: 6, 4: 5,
            5: 4, 6: 3, 7: 2, 8: 1
          }
        }
      }
      tournaments.push(tournament)

      localStorage.setItem(
        'tournaments',
        JSON.stringify(tournaments)
      )

      showTournaments()
    })


  // ポイント設定ボタン
  document.querySelectorAll('.point-setting-btn')
    .forEach(button => {
      button.addEventListener('click', () => {
        showPointSettings(Number(button.dataset.index))
      })
    })

  // MVPボタン
  document.querySelectorAll('.mvp-btn')
    .forEach(button => {
      button.addEventListener('click', () => {
        showMvpSettings(Number(button.dataset.index))
      })
    })

  // 大会削除ボタン
  document.querySelectorAll('.delete-btn')
    .forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index)

        if (!confirm('この大会を削除しますか？')) return

        tournaments.splice(index, 1)
        localStorage.setItem('tournaments', JSON.stringify(tournaments))
        showTournaments()
      })
    })
}
function showPointSettings(index) {
  const tournament = tournaments[index]

  if (!tournament.pointSettings) {
    tournament.pointSettings = {
      killEnabled: true,
      killRate: 2,
      damageEnabled: true,
      damageUnit: 100,
      damageRate: 1,
      placementEnabled: true,
      placementPoints: {
        1: 20,
        2: 15,
        3: 12,
        4: 10,
        5: 8,
        6: 6,
        7: 4,
        8: 2
      }
    }
  }

  const settings = tournament.pointSettings

  content.innerHTML = `
    <h2>⚙️ ${escapeHTML(tournament.name)} ポイント設定</h2>

    <form id="point-settings-form">

      <div class="panel">
        <h3>⚔️ キルポイント</h3>
        <label>
          <input type="checkbox" id="kill-enabled"
            ${settings.killEnabled ? 'checked' : ''}>
          キルを使用する
        </label>
        <p>1キルあたりのポイント</p>
        <input type="number" id="kill-rate"
         min="0" value="${settings.killRate}">
         <p>1人が獲得できるキルポイントの上限</p>
<input type="number" id="kill-max-points"
  min="0" value="${settings.killMaxPoints ?? 10}">
      </div>

      <div class="panel">
        <h3>💥 ダメージポイント</h3>
        <label>
          <input type="checkbox" id="damage-enabled"
            ${settings.damageEnabled ? 'checked' : ''}>
          ダメージを使用する
        </label>
        <p>何ダメージごとにポイントを付けるか</p>
        <input type="number" id="damage-unit"
          min="1" value="${settings.damageUnit}">
        <p>そのときのポイント</p>
        <input type="number" id="damage-rate"
          min="0" value="${settings.damageRate}">
         <p>1人が獲得できるダメージポイントの上限</p>
<input type="number" id="damage-max-points"
  min="0" value="${settings.damageMaxPoints ?? 15}"> 
      </div>

      <div class="panel">
        <h3>🏆 順位ポイント</h3>
        <label>
          <input type="checkbox" id="placement-enabled"
            ${settings.placementEnabled ? 'checked' : ''}>
          順位を使用する
        </label>

        ${Array.from({ length: 8 }, (_, i) => {
          const rank = i + 1
          return `
            <p>${rank}位のポイント</p>
            <input type="number" min="0"
              id="placement-${rank}"
              value="${settings.placementPoints[rank] ?? 0}">
          `
        }).join('')}
      </div>
      <div class="panel">
        <h3>🏅 MVPの決め方</h3>
        <select id="mvp-mode">
          <option value="points"
            ${(tournament.mvpMode || 'points') === 'points' ? 'selected' : ''}>
            ① 個人ポイント制（自動）
          </option>

          <option value="manual"
            ${tournament.mvpMode === 'manual' ? 'selected' : ''}>
            ② 手動選択
          </option>

          <option value="combined"
            ${tournament.mvpMode === 'combined' ? 'selected' : ''}>
            ③ 総合評価制（自動）
          </option>
        </select>
      </div>
      <button type="submit">設定を保存する</button>
      <button type="button" id="back-tournaments">
        大会一覧に戻る
      </button>
    </form>
  `

  document.querySelector('#point-settings-form')
    .addEventListener('submit', event => {
      event.preventDefault()

      settings.killEnabled =
        document.querySelector('#kill-enabled').checked
      settings.killRate =
        Number(document.querySelector('#kill-rate').value)
settings.killMaxPoints =
  Number(document.querySelector('#kill-max-points').value)
      settings.damageEnabled =
        document.querySelector('#damage-enabled').checked
      settings.damageUnit =
        Number(document.querySelector('#damage-unit').value)
      settings.damageRate =
        Number(document.querySelector('#damage-rate').value)
        settings.damageMaxPoints =
  Number(document.querySelector('#damage-max-points').value)

      settings.placementEnabled =
  document.querySelector('#placement-enabled').checked

tournament.mvpMode =
  document.querySelector('#mvp-mode').value
      settings.placementPoints = {}

      for (let rank = 1; rank <= 8; rank++) {
        settings.placementPoints[rank] =
          Number(document.querySelector(`#placement-${rank}`).value)
      }

      localStorage.setItem(
        'tournaments',
        JSON.stringify(tournaments)
      )

      alert('ポイント設定を保存したよ！')
      showTournaments()
    })

  document.querySelector('#back-tournaments')
    .addEventListener('click', () => {
      showTournaments()
    })
}
function showRanking() {
  if (tournaments.length === 0) {
    content.innerHTML = `
      <h2>🏆 大会別ランキング</h2>
      <div class="panel">
        <p>先に大会一覧から大会を登録してね！</p>
      </div>
    `
    return
  }

  content.innerHTML = `
    <h2>🏆 大会別ランキング</h2>

    <div class="panel">
      <h3>大会を選択</h3>
      <select id="score-tournament">
        ${tournaments.map(t => `
          <option value="${escapeHTML(t.name)}">
            ${escapeHTML(t.name)}
          </option>
        `).join('')}
      </select>
    </div>

    <div id="ranking-list"></div>
  `

  const select = document.querySelector('#score-tournament')
  const list = document.querySelector('#ranking-list')


function renderRanking() {
  const key = select.value

  const labels = {
    points: 'pt',
    kills: 'キル',
    damage: 'ダメージ'
  }

  const ranking = Object.entries(players)
    .sort((a, b) => b[1][key] - a[1][key])

  list.innerHTML = ranking.length === 0
    ? '<p>まだ個人成績が登録されていません。</p>'
    : ranking.map(([name, data], index) => `
        <div class="panel">
          <h3>${index + 1}位　${escapeHTML(name)}</h3>

          <h2>${data[key]} ${labels[key]}</h2>

          <p>🏆 合計ポイント：${data.points} pt</p>
          <p>⚔️ 合計キル：${data.kills}</p>
          <p>💥 合計ダメージ：${data.damage}</p>
          <p>🎟️ 大会参加数：${data.tournaments.size}</p>
          <p>🎮 試合数：${data.matches}</p>
          <p>🥇 1位回数：${data.wins}</p>
          <p>🏅 MVP獲得回数：${data.mvpWins}回</p>

          <button class="player-profile-btn"
            data-index="${index}">
            👤 プロフィールを見る
          </button>
        </div>
      `).join('')

  document.querySelectorAll('.player-profile-btn')
    .forEach(button => {
      button.addEventListener('click', () => {
        const [name, data] = ranking[Number(button.dataset.index)]

        const winRate = data.matches
          ? (data.wins / data.matches * 100).toFixed(1)
          : '0.0'

        const characterList = Object.entries(data.characters)
          .sort((a, b) => b[1] - a[1])
          .map(([character, uses]) =>
            `<p>${escapeHTML(character)}：${uses}回</p>`
          ).join('') || '<p>まだ記録がありません。</p>'

        list.innerHTML = `
          <div class="panel">
            <h2>👤 ${escapeHTML(name)} のプロフィール</h2>

            <h3>📊 総合成績</h3>
            <p>🏆 合計ポイント：${data.points} pt</p>
            <p>⚔️ 合計キル：${data.kills}</p>
            <p>💥 合計ダメージ：${data.damage}</p>

            <h3>🎮 試合成績</h3>
            <p>試合数：${data.matches}回</p>
            <p>🥇 1位回数：${data.wins}回</p>
            <p>📊 勝率：${winRate}%</p>
            <p>🎟️ 大会参加数：${data.tournaments.size}</p>
            <p>🏅 MVP獲得回数：${data.mvpWins}回</p>

            <h3>🎭 使用キャラクター</h3>
            ${characterList}

            <button id="back-to-ranking">
              ← 個人成績に戻る
            </button>
          </div>
        `

        document.querySelector('#back-to-ranking')
          .addEventListener('click', renderRanking)
      })
    })
}

  select.addEventListener('change', renderRanking)
  renderRanking()
}
function showEditScore(index) {
  const score = scores[index]

  if (!score) return

  const tournament = tournaments.find(
    t => t.name === score.tournament
  )

  const settings = tournament.pointSettings || {
    killEnabled: true,
    killRate: 2,
    damageEnabled: true,
    damageUnit: 100,
    damageRate: 1,
    placementEnabled: true,
    placementPoints: {
      1: 20, 2: 15, 3: 12, 4: 10,
      5: 8, 6: 6, 7: 4, 8: 2
    }
  }

  content.innerHTML = `
    <h2>✏️ 登録内容を編集</h2>

    <form id="edit-score-form">
      <label>チーム名</label>
      <input
        id="edit-team"
        value="${escapeHTML(score.team)}"
        required
      >

      ${settings.killEnabled ? `
        <label>キル数</label>
        <input
          id="edit-kills"
          type="number"
          min="0"
          value="${score.kills ?? 0}"
        >
      ` : ''}

      ${settings.damageEnabled ? `
        <label>ダメージ</label>
        <input
          id="edit-damage"
          type="number"
          min="0"
          value="${score.damage ?? 0}"
        >
      ` : ''}

      ${settings.placementEnabled ? `
        <label>順位</label>
        <select id="edit-placement">
          ${[1,2,3,4,5,6,7,8].map(place => `
            <option
              value="${place}"
              ${Number(score.placement) === place ? 'selected' : ''}
            >
              ${place}位
            </option>
          `).join('')}
        </select>
      ` : ''}

      <button type="submit">変更を保存</button>
      <button type="button" id="cancel-edit">キャンセル</button>
    </form>
  `

  document.querySelector('#cancel-edit').addEventListener('click', () => {
    showRanking()
  })
    document.querySelector('#edit-score-form').addEventListener('submit', event => {
    event.preventDefault()

    const hasDetailedStats =
      score.kills !== undefined ||
      score.damage !== undefined ||
      score.placement !== undefined

    const kills = settings.killEnabled
      ? Number(document.querySelector('#edit-kills').value || 0)
      : (score.kills ?? 0)

    const damage = settings.damageEnabled
      ? Number(document.querySelector('#edit-damage').value || 0)
      : (score.damage ?? 0)

    const placement = settings.placementEnabled
      ? Number(document.querySelector('#edit-placement').value || 0)
      : (score.placement ?? 0)

    let points = score.points

    if (hasDetailedStats) {
      points = 0

     if (settings.killEnabled) {
  const killPoints =
    kills * Number(settings.killRate || 0)

  points += Math.min(
    killPoints,
    Number(settings.killMaxPoints ?? 10)
  )
}

if (settings.damageEnabled) {
  const unit = Number(settings.damageUnit) || 1

  const damagePoints =
    Math.floor(damage / unit) *
    Number(settings.damageRate || 0)

  points += Math.min(
    damagePoints,
    Number(settings.damageMaxPoints ?? 15)
  )
}

      if (settings.placementEnabled) {
        points += Number(settings.placementPoints?.[placement] || 0)
      }
    }

    scores[index] = {
      ...score,
      team: document.querySelector('#edit-team').value,
      kills,
      damage,
      placement,
      points
    }

    localStorage.setItem('scores', JSON.stringify(scores))
    showRanking()
  })
}
function showRegister() {
  if (tournaments.length === 0) {
    content.innerHTML = `
      <h2>ポイント登録</h2>
      <div class="panel">
        <p>先に大会一覧から大会を登録してね！</p>
      </div>
    `
    return
  }

  content.innerHTML = `
    <h2>📝 ポイント登録</h2>

    <div class="panel">
      <form id="register-form">

        <h3>大会を選択</h3>
        <select id="register-tournament">
          ${tournaments.map(t => `
            <option value="${escapeHTML(t.name)}">
              ${escapeHTML(t.name)}
            </option>
          `).join('')}
        </select>

        
      <h3>チーム名</h3>
<select id="register-team" required>
</select>
        <div id="stat-inputs"></div>

        <div class="panel">
          <h3>🏆 チーム合計ポイント</h3>
          <strong id="calculated-points">0 pt</strong>
        </div>

        <button type="submit">ポイントを登録</button>
      </form>
    </div>
  `

  const tournamentSelect =
    document.querySelector('#register-tournament')
    const teamSelect = document.querySelector('#register-team')
 function renderTeamOptions() {
  const tournament = tournaments.find(
    t => t.name === tournamentSelect.value
  )

  const teams = tournament?.teams || []

  teamSelect.innerHTML = teams.length
    ? teams.map(team => `
        <option value="${escapeHTML(team.name)}">
          ${escapeHTML(team.name)}
        </option>
      `).join('')
    : '<option value="">チーム未登録</option>'
}
    const statInputs =
    document.querySelector('#stat-inputs')
  const totalDisplay =
    document.querySelector('#calculated-points')

  function getSettings() {
    const tournament = tournaments.find(
      t => t.name === tournamentSelect.value
    )

    return tournament.pointSettings || {
      killEnabled: true,
      killRate: 2,
      damageEnabled: true,
      damageUnit: 100,
      damageRate: 1,
      placementEnabled: true,
      placementPoints: {
        1: 20, 2: 15, 3: 12, 4: 10,
        5: 8, 6: 6, 7: 4, 8: 2
      }
    }
  }

  function renderInputs() {
  const settings = getSettings()

const tournament = tournaments.find(
  t => t.name === tournamentSelect.value
)

const selectedTeam = tournament?.teams?.find(
  team => team.name === teamSelect.value
)

const members = selectedTeam?.members || []

    statInputs.innerHTML = `
      ${[1, 2, 3].map(i => `
        <div class="panel">
          <h3>👤 選手${i}</h3>

          <label>選手名</label>
          <input
  id="player-name-${i}"
  value="${escapeHTML(members[i - 1] || '')}"
  required
  readonly
  placeholder="選手名"
>

          ${settings.killEnabled ? `
            <label>⚔️ キル数</label>
            <input
              id="player-kills-${i}"
              type="number"
              min="0"
              value="0"
              required
            >
          ` : ''}

          ${settings.damageEnabled ? `
            <label>💥 ダメージ</label>
            <input
              id="player-damage-${i}"
              type="number"
              min="0"
              value="0"
              required
            >
          ` : ''}

          <p>
            個人ポイント：
            <strong id="player-points-${i}">0 pt</strong>
          </p>
        </div>
      `).join('')}

      ${settings.placementEnabled ? `
        <h3>🏆 チーム順位</h3>
        <select id="register-placement">
          ${Array.from({ length: 8 }, (_, i) => `
            <option value="${i + 1}">${i + 1}位</option>
          `).join('')}
        </select>
      ` : ''}
    `

    statInputs.querySelectorAll('input, select')
      .forEach(input => {
        input.addEventListener('input', calculatePoints)
        input.addEventListener('change', calculatePoints)
      })

    calculatePoints()
  }

  function calculatePoints() {
    const settings = getSettings()

    const players = [1, 2, 3].map(i => {
      const kills = Number(
        document.querySelector(`#player-kills-${i}`)?.value || 0
      )

      const damage = Number(
        document.querySelector(`#player-damage-${i}`)?.value || 0
      )

      let points = 0

     if (settings.killEnabled) {
  const killPoints =
    kills * Number(settings.killRate || 0)

  points += Math.min(
    killPoints,
    Number(settings.killMaxPoints ?? 10)
  )
}

if (settings.damageEnabled) {
  const unit = Number(settings.damageUnit) || 1

  const damagePoints =
    Math.floor(damage / unit) *
    Number(settings.damageRate || 0)

  points += Math.min(
    damagePoints,
    Number(settings.damageMaxPoints ?? 15)
  )
}

      const display = document.querySelector(
        `#player-points-${i}`
      )

      if (display) {
        display.textContent = `${points} pt`
      }

      return {
        name: document.querySelector(`#player-name-${i}`).value,
        kills,
        damage,
        points
      }
    })

    const placement = Number(
      document.querySelector('#register-placement')?.value || 0
    )

    const individualTotal = players.reduce(
      (sum, player) => sum + player.points,
      0
    )

    const placementPoints = settings.placementEnabled
      ? Number(settings.placementPoints?.[placement] || 0)
      : 0

    const teamPoints = individualTotal + placementPoints

    totalDisplay.textContent = `${teamPoints} pt`

    return {
      players,
      placement,
      teamPoints
    }
  }

  tournamentSelect.addEventListener('change', () => {
  renderTeamOptions()
  renderInputs()
})

teamSelect.addEventListener('change', renderInputs)

renderTeamOptions()
renderInputs()

  renderInputs()

  document.querySelector('#register-form')
    .addEventListener('submit', event => {
      event.preventDefault()

      const tournament = tournaments.find(
        t => t.name === tournamentSelect.value
      )

      const result = calculatePoints()

      const totalKills = result.players.reduce(
        (sum, player) => sum + player.kills, 0
      )

      const totalDamage = result.players.reduce(
        (sum, player) => sum + player.damage, 0
      )

      scores.push({
        tournament: tournament.name,
        team: document.querySelector('#register-team').value,
        points: result.teamPoints,
        kills: totalKills,
        damage: totalDamage,
        placement: result.placement,
        players: result.players
      })

      localStorage.setItem('scores', JSON.stringify(scores))

      showRegister()
    })
}

      showRegister()

function showOverallRanking() {
  content.innerHTML = `
    <h2>🏆 総合ランキング</h2>
    <div id="overall-list"></div>
  `

  const list = document.querySelector('#overall-list')
  const totals = {}

  scores.forEach(score => {
    const team = String(score.team).trim()
    if (!team) return

    if (!totals[team]) {
      totals[team] = {
        points: 0,
        tournaments: new Set()
      }
    }

    totals[team].points += Number(score.points) || 0
    totals[team].tournaments.add(score.tournament)
  })

  const ranking = Object.entries(totals)
    .sort((a, b) => b[1].points - a[1].points)

  list.innerHTML = `
    <h3>総合順位表</h3>

    ${ranking.length === 0
      ? '<p>まだポイントが登録されていません。</p>'
      : ranking.map(([team, data], index) => `
        <div class="panel">
          <h3>
            ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1) + '位'}
            ${escapeHTML(team)}
          </h3>
          <strong>${data.points} pt</strong>
          <p>参加大会数：${data.tournaments.size}</p>
        </div>
      `).join('')
    }
  `
}

function showIndividualRanking() {
  const players = {}

  function getPlayer(name) {
    if (!players[name]) {
      players[name] = {
        points: 0,
        kills: 0,
        damage: 0,
        tournaments: new Set(),
               matches: 0,
        wins: 0,
        mvpWins: 0,
        characters: {}
      }
    }
    return players[name]
  }

  // ポイント・キル・ダメージを集計
  scores.forEach(score => {
    if (!Array.isArray(score.players)) return

    score.players.forEach(player => {
      const name = String(player.name || '').trim()
      if (!name) return

      const data = getPlayer(name)

      data.points += Number(player.points) || 0
      data.kills += Number(player.kills) || 0
      data.damage += Number(player.damage) || 0

      if (score.tournament) {
        data.tournaments.add(score.tournament)
      }
    })
  })

  // 試合数・勝利数・使用キャラを集計
  matches.forEach(match => {
    if (!Array.isArray(match.players)) return

    match.players.forEach(player => {
      const name = String(player.name || '').trim()
      if (!name) return

      const data = getPlayer(name)

      data.matches++
      if (String(match.result) === '1') {
        data.wins++
      }

      if (match.tournament) {
        data.tournaments.add(match.tournament)
      }

      const characterName =
        `${player.character || '不明'}（${player.style || '通常スタイル'}）`

      data.characters[characterName] =
        (data.characters[characterName] || 0) + 1
    })
  })
   // MVP獲得回数を集計
  tournaments.forEach(tournament => {
    const winner = String(tournament.mvpWinner || '').trim()
    if (!winner) return

    const data = getPlayer(winner)
    data.mvpWins++
  })
  content.innerHTML = `
    <h2>🏅 個人成績</h2>

    <div class="panel">
      <h3>ランキングの種類</h3>
      <select id="individual-sort">
        <option value="points">🏆 ポイント順</option>
        <option value="kills">⚔️ キル数順</option>
        <option value="damage">💥 ダメージ順</option>
      </select>
    </div>

    <div id="individual-list"></div>
  `

  const select = document.querySelector('#individual-sort')
  const list = document.querySelector('#individual-list')

  function renderRanking() {
    const key = select.value

    const labels = {
      points: 'pt',
      kills: 'キル',
      damage: 'ダメージ'
    }

    const ranking = Object.entries(players)
      .sort((a, b) => b[1][key] - a[1][key])

    list.innerHTML = ranking.length === 0
      ? '<p>まだ個人成績が登録されていません。</p>'
      : ranking.map(([name, data], index) => {
          const winRate = data.matches
            ? (data.wins / data.matches * 100).toFixed(1)
            : '0.0'

          const characterList =
            Object.entries(data.characters)
              .sort((a, b) => b[1] - a[1])
              .map(([character, uses]) =>
                `<p>${escapeHTML(character)}：${uses}回</p>`
              ).join('') || '<p>まだ記録がありません。</p>'

          return `
            <div class="panel">
              <h3>${index + 1}位　${escapeHTML(name)}</h3>

              <h2>${data[key]} ${labels[key]}</h2>

              <p>🏆 合計ポイント：${data.points} pt</p>
              <p>⚔️ 合計キル：${data.kills}</p>
              <p>💥 合計ダメージ：${data.damage}</p>
              <p>🎟️ 大会参加数：${data.tournaments.size}</p>
              <p>🎮 試合数：${data.matches}</p>
              <p>🥇 1位回数：${data.wins}</p>
              <p>🏅 MVP獲得回数：${data.mvpWins}回</p>
              <p>📊 勝率：${winRate}%</p>

              <h4>👤 使用キャラクター</h4>
              ${characterList}
            </div>
          `
        }).join('')
  }

  select.addEventListener('change', renderRanking)
  renderRanking()
}
function showMatchRegister() {
  const tournamentOptions = tournaments.map(t => `
    <option value="${escapeHTML(t.name)}">
      ${escapeHTML(t.name)}
    </option>
  `).join('')

  content.innerHTML = `
    <h2>🎮 試合記録</h2>

    <div class="panel">
      <h3>🏆 大会を選択</h3>
      <select id="match-tournament">
        <option value="">大会を選択</option>
        ${tournamentOptions}
      </select>

      <h3>👥 チームを選択</h3>
      <select id="match-team" disabled>
        <option value="">先に大会を選択</option>
      </select>
    </div>

    <div id="match-players"></div>

    <div class="panel">
      <h3>🏅 試合結果</h3>
      <select id="match-result">
        <option value="1">1位</option>
        <option value="2">2位</option>
        <option value="3">3位</option>
        <option value="other">その他</option>
      </select>

      <button id="save-match">試合記録を保存</button>
    </div>
  `

  const tournamentSelect =
    document.querySelector('#match-tournament')
  const teamSelect =
    document.querySelector('#match-team')
  const playersArea =
    document.querySelector('#match-players')

  tournamentSelect.addEventListener('change', () => {
    const tournament = tournaments.find(
      t => t.name === tournamentSelect.value
    )

    teamSelect.innerHTML = `
      <option value="">チームを選択</option>
      ${(tournament?.teams || []).map(team => `
        <option value="${escapeHTML(team.name)}">
          ${escapeHTML(team.name)}
        </option>
      `).join('')}
    `

    teamSelect.disabled = !tournament
    playersArea.innerHTML = ''
  })

  teamSelect.addEventListener('change', () => {
    const tournament = tournaments.find(
      t => t.name === tournamentSelect.value
    )

    const team = tournament?.teams?.find(
      t => t.name === teamSelect.value
    )

    const members = (team?.members || []).map(member =>
      typeof member === 'string' ? member : member.name
    )

    playersArea.innerHTML = `
      <div class="panel">
        <h3>👤 選手・キャラクター</h3>

        ${[0, 1, 2].map(index => `
          <div class="card">
            <h3>${index + 1}人目</h3>

            <input
              class="match-player-name"
              value="${escapeHTML(members[index] || '')}"
              placeholder="選手名"
            >

            <select class="match-character">
              <option value="">キャラクターを選択</option>
              ${characters.map((character, characterIndex) => `
                <option value="${characterIndex}">
                  ${escapeHTML(character.name)}
                  （${escapeHTML(character.style || '通常スタイル')}）
                </option>
              `).join('')}
            </select>
          </div>
        `).join('')}
      </div>
    `
  })

  document.querySelector('#save-match')
    .addEventListener('click', () => {
      const tournament = tournamentSelect.value
      const team = teamSelect.value
      const result = document.querySelector('#match-result').value

      if (!tournament || !team) {
        alert('大会とチームを選択してください。')
        return
      }

      const names = [
        ...document.querySelectorAll('.match-player-name')
      ]

      const characterSelects = [
        ...document.querySelectorAll('.match-character')
      ]

      const players = names.map((input, index) => {
        const characterIndex = characterSelects[index].value
        const character = characters[Number(characterIndex)]

        return {
          name: input.value.trim(),
          character: character?.name || '',
          style: character?.style || '通常スタイル'
        }
      })

      if (players.some(player => !player.name || !player.character)) {
        alert('3人全員の選手名とキャラクターを入力してください。')
        return
      }

      matches.push({
        tournament,
        team,
        result,
        players,
        date: new Date().toISOString()
      })

      saveMatches()

      alert('試合記録を保存しました！')
      showMatchRegister()
    })
}
function showCharacterStats(selectedTournament = 'all') {
  const stats = {}

const filteredMatches = selectedTournament === 'all'
  ? matches
  : matches.filter(match => match.tournament === selectedTournament)

filteredMatches.forEach(match => {
    match.players.forEach(player => {
      const character = characters.find(
        c => c.name === player.character
      )

     const style = player.style || character?.style || '通常スタイル'
      const key = `${player.character}_${style}`

  if (!stats[key]) {
  stats[key] = {
    name: player.character,
    style,
    uses: 0,
    wins: 0,
    placements: {
      '1': 0,
      '2': 0,
      '3': 0,
      other: 0
    }
  }
}

      stats[key].uses++
const result = ['1', '2', '3'].includes(String(match.result))
  ? String(match.result)
  : 'other'

stats[key].placements[result]++
       if (match.result === '1') {
        stats[key].wins++
      }
    })
  })

  const ranking = Object.values(stats)
    .map(item => ({
      ...item,
      winRate: item.uses
        ? (item.wins / item.uses * 100).toFixed(1)
        : 0
    }))
    .sort((a, b) => b.uses - a.uses)

  content.innerHTML = `
    
    <h2>📊 キャラ分析</h2>
   <div class="panel">
  <h3>🏆 大会を選択</h3>
 <select id="character-tournament">
  <option value="all" ${selectedTournament === 'all' ? 'selected' : ''}>
    すべての大会
  </option>

  ${tournaments.map(t => `
    <option
      value="${escapeHTML(t.name)}"
      ${selectedTournament === t.name ? 'selected' : ''}
    >
      ${escapeHTML(t.name)}
    </option>
  `).join('')}
</select>
</div>
<div class="panel">
  <h3>👤 キャラクターを選択</h3>
  <select id="character-select">
 <option value="" disabled selected>キャラクターを選択</option>
    ${ranking.map(item => `
      <option value="${escapeHTML(item.name + '_' + item.style)}">
        ${escapeHTML(item.name)}（${escapeHTML(item.style)}）
      </option>
    `).join('')}
  </select>
</div>

<div id="character-chart"></div>
    <h3>使用回数ランキング</h3>

    ${
      ranking.length === 0
        ? '<p>まだ試合記録がありません。</p>'
        : ranking.map((item, index) => `
          <div class="card">
            <strong>${index + 1}位：${escapeHTML(item.name)}</strong>
            <p>スタイル：${escapeHTML(item.style)}</p>
            <p>使用回数：${item.uses}回</p>
            <p>勝利回数：${item.wins}回</p>
            <p>勝率：${item.winRate}%</p>
          </div>
        `).join('')
    }
  `

  document.querySelector('#character-tournament')
    .addEventListener('change', event => {
      showCharacterStats(event.target.value)
    })
  document.querySelector('#character-select')
  document.querySelector('#character-select')
    .addEventListener('change', event => {
      const selectedKey = event.target.value

      const item = ranking.find(
        item => `${item.name}_${item.style}` === selectedKey
      )

      const chart = document.querySelector('#character-chart')

      if (!item) {
        chart.innerHTML = ''
        return
      }

      const p = item.placements
      const total = p['1'] + p['2'] + p['3'] + p.other

      const first = total ? p['1'] / total * 100 : 0
      const second = total ? p['2'] / total * 100 : 0
      const third = total ? p['3'] / total * 100 : 0

      const secondEnd = first + second
      const thirdEnd = secondEnd + third

      const gradient = total
        ? `conic-gradient(
            #f5c542 0% ${first}%,
            #a8b8d0 ${first}% ${secondEnd}%,
            #cd7f32 ${secondEnd}% ${thirdEnd}%,
            #888 ${thirdEnd}% 100%
          )`
        : '#ddd'

      chart.innerHTML = `
        <div class="card">
          <h3>🏆 ${escapeHTML(item.name)} の順位割合</h3>

          <div style="
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: ${gradient};
            margin: 20px auto;
          "></div>

          <p>🟡 1位：${p['1']}回（${first.toFixed(1)}%）</p>
          <p>🔵 2位：${p['2']}回（${second.toFixed(1)}%）</p>
          <p>🟤 3位：${p['3']}回（${third.toFixed(1)}%）</p>
          <p>⚫ その他：${p.other}回（${total ? (p.other / total * 100).toFixed(1) : 0}%）</p>
          <p>合計：${total}回</p>
        </div>
      `
    })
}
function showCharacterManager() {
  content.innerHTML = `
    <h2>👤 キャラクター管理</h2>
  

    <div class="panel">
      <h3>新しいキャラクターを追加</h3>

      <form id="character-form">
        <label>キャラクター名</label>
        <input
          id="character-name"
          required
          placeholder="例：轟焦凍"
        >

        <label>バトルスタイル（任意）</label>
        <input
          id="character-style"
          placeholder="例：氷牙風炎"
        >

        <button type="submit">➕ キャラクターを追加</button>
      </form>
    </div>

    <h3>登録済みキャラクター</h3>
    <div id="character-list"></div>
  `

  const form = document.querySelector('#character-form')
  const list = document.querySelector('#character-list')

  function renderCharacters() {
    list.innerHTML = characters.length === 0
      ? '<p>まだキャラクターが登録されていません。</p>'
      : characters.map((character, index) => `
          <div class="panel">
            <strong>${escapeHTML(character.name)}</strong>
            <p>${escapeHTML(character.style || '通常スタイル')}</p>
            <button class="edit-character" data-index="${index}">
              ✏️ 編集
            </button>
            <button class="delete-character" data-index="${index}">
              🗑️ 削除
            </button>
          </div>
        `).join('')

    document.querySelectorAll('.edit-character')
      .forEach(button => {
        button.addEventListener('click', () => {
          const index = Number(button.dataset.index)
          const character = characters[index]

          const name = prompt(
            'キャラクター名',
            character.name
          )

          if (name === null || !name.trim()) return

          const style = prompt(
            'バトルスタイル（通常なら空欄）',
            character.style || ''
          )

          if (style === null) return

          characters[index] = {
            name: name.trim(),
            style: style.trim()
          }

          saveCharacters()
          renderCharacters()
        })
      })

    document.querySelectorAll('.delete-character')
      .forEach(button => {
        button.addEventListener('click', () => {
          const index = Number(button.dataset.index)

          if (!confirm('このキャラクターを削除しますか？')) {
            return
          }

          characters.splice(index, 1)
          saveCharacters()
          renderCharacters()
        })
      })
  }

  form.addEventListener('submit', event => {
    event.preventDefault()

    const name = document.querySelector('#character-name').value.trim()
    const style = document.querySelector('#character-style').value.trim()

    if (!name) return

    characters.push({ name, style })

    saveCharacters()
    form.reset()
    renderCharacters()
  })

  renderCharacters()
}
function showTeam() {
  const teams = [...new Set(
    scores.map(score => String(score.team).trim()).filter(Boolean)
  )]

  if (teams.length === 0) {
    content.innerHTML = `
      <h2>👥 チーム詳細</h2>
      <div class="panel">
        <p>まだチームのポイントが登録されていません。</p>
      </div>
    `
    return
  }

  content.innerHTML = `
    <h2>👥 チーム詳細</h2>
    <div class="panel">
      <h3>チームを選択</h3>
      <select id="team-select">
        ${teams.map(team => `
          <option value="${escapeHTML(team)}">
            ${escapeHTML(team)}
          </option>
        `).join('')}
      </select>
    </div>
    <div id="team-info"></div>
  `

  const select = document.querySelector('#team-select')
  const info = document.querySelector('#team-info')

  function renderTeam() {
    const team = select.value

    const records = scores.filter(
      score => String(score.team).trim() === team
    )

    const total = records.reduce(
      (sum, score) => sum + (Number(score.points) || 0), 0
    )

    const participated = [...new Set(
      records.map(record => record.tournament)
    )]

    const wins = tournaments.filter(
      tournament => tournament.winner.trim() === team
    ).length
  // チームメンバーを取得
const members = [...new Set(
  matches
    .filter(match => String(match.team).trim() === team)
    .flatMap(match => match.players || [])
    .map(player => String(player.name).trim())
    .filter(Boolean)
)]

// チームの合計キル数
const totalKills = records.reduce(
  (sum, record) => sum + (
    record.players || []
  ).reduce(
    (playerSum, player) =>
      playerSum + (Number(player.kills) || 0), 0
  ), 0
)

// チームの合計ダメージ
const totalDamage = records.reduce(
  (sum, record) => sum + (
    record.players || []
  ).reduce(
    (playerSum, player) =>
      playerSum + (Number(player.damage) || 0), 0
  ), 0
)
// メンバー別の成績を集計
const memberStats = {}

records.forEach(record => {
  if (!Array.isArray(record.players)) return

  record.players.forEach(player => {
    const name = String(player.name || '').trim()
    if (!name) return

    if (!memberStats[name]) {
      memberStats[name] = {
        points: 0,
        kills: 0,
        damage: 0
      }
    }

    memberStats[name].points += Number(player.points) || 0
    memberStats[name].kills += Number(player.kills) || 0
    memberStats[name].damage += Number(player.damage) || 0
  })
})
    const tournamentTotals = {}

    records.forEach(record => {
      const name = record.tournament
      const points = Number(record.points) || 0

      tournamentTotals[name] = (tournamentTotals[name] || 0) + points
    })

    const graphRecords = Object.entries(tournamentTotals)

    const maxPoints = Math.max(
      ...graphRecords.map(([name, points]) => points),
      1
    )

    info.innerHTML = `
    <div class="panel">
  <h2>🏆 ${escapeHTML(team)}</h2>
  <h3>合計ポイント：${total} pt</h3>
  <p>👥 メンバー：${members.length > 0
    ? members.map(escapeHTML).join('・')
    : 'まだ登録されていません'}</p>
  <p>⚔️ 合計キル数：${totalKills}</p>
  <p>💥 合計ダメージ：${totalDamage}</p>
  <p>🏅 参加大会数：${participated.length}</p>
  <p>🥇 優勝回数：${wins} 回</p>
</div>
<div class="panel">
  <h3>👥 メンバー別プロフィール</h3>

  ${Object.entries(memberStats).length === 0
    ? '<p>まだメンバーの成績がありません。</p>'
    : Object.entries(memberStats).map(([name, data]) => `
      <div class="panel">
        <h3>👤 ${escapeHTML(name)}</h3>
        <p>🏆 ポイント：${data.points} pt</p>
        <p>⚔️ キル数：${data.kills}</p>
        <p>💥 ダメージ：${data.damage}</p>
      </div>
    `).join('')
  }
</div>

      <div class="panel">
        <h3>📊 大会別ポイント推移</h3>

        ${graphRecords.length === 0
          ? '<p>記録がありません。</p>'
          : graphRecords.map(([name, points]) => {
              const width = points / maxPoints * 100

              return `
                <div style="margin-bottom: 18px;">
                  <p>${escapeHTML(name)}：${points} pt</p>
                  <div style="background: #333; height: 18px; border-radius: 9px; overflow: hidden;">
                    <div style="width: ${width}%; height: 18px; background: #38a8ff;"></div>
                  </div>
                </div>
              `
            }).join('')
        }
      </div>

      <h3>大会履歴</h3>

      ${records.map(record => `
        <div class="panel">
          <h3>${escapeHTML(record.tournament)}</h3>
          <strong>${Number(record.points) || 0} pt</strong>
        </div>
      `).join('')}
    `
  }

  select.addEventListener('change', renderTeam)
  renderTeam()
}
function saveMatches() {
  localStorage.setItem('matches', JSON.stringify(matches))
}
function saveCharacters() {
  localStorage.setItem(
    'characters',
    JSON.stringify(characters)
  )
}
function showPage(page) {
  if (page === 'home') showHome()
  if (page === 'tournament') showTournaments()
  if (page === 'register') showRegister()
  if (page === 'ranking') showRanking()
  if (page === 'overall') showOverallRanking()
 if (page === 'individual') showIndividualRanking()
 if (page === 'matches') showMatchRegister()
 if (page === 'characters') showCharacterManager()
 if (page === 'character-stats') showCharacterStats()
if (page === 'team') showTeam()
 if (page === 'settings') {
  const logs = JSON.parse(
    localStorage.getItem('warningLogs') || '[]'
  )

  content.innerHTML = `
    <h2>⚙️ 設定</h2>

    <div class="panel">
      <h3>🚨 緊急リセット</h3>
      <p>全チームのポイントを削除します。</p>
      <p>大会情報は削除されません。</p>

      <button id="emergency-reset">
        ⚠️ 緊急リセットを実行
      </button>
    </div>

    <div class="panel">
      <h3>📋 警告ログ</h3>
      <div id="warning-log-list">
        ${
          logs.length === 0
            ? '<p>記録はありません。</p>'
            : logs.map(log => `
              <div class="panel">
                <p>${escapeHTML(log.date)}</p>
                <p>${escapeHTML(log.message)}</p>
                <p>削除件数：${log.count}件</p>
              </div>
            `).join('')
        }
      </div>
    </div>
  `

  document.querySelector('#emergency-reset')
    .addEventListener('click', () => {
      const confirmed = confirm(
        '本当に全ポイントを削除しますか？この操作は元に戻せません。'
      )

      if (!confirmed) return

      const count = scores.length

      scores = []

      localStorage.setItem('scores', JSON.stringify(scores))

      logs.unshift({
        date: new Date().toLocaleString('ja-JP'),
        message: '🚨 緊急リセット実行',
        count: count
      })

      localStorage.setItem(
        'warningLogs',
        JSON.stringify(logs)
      )

      alert('緊急リセットが完了しました。')

      showPage('settings')
    })
}
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.page === page
    )
  })
}
document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', () => {
    showPage(button.dataset.page)
  })
})

showHome()