from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from controllers.db_manager import DBManager

# ⚠️ IMPORTANTE: Defina o app antes de usar @app.route
app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SECRET_KEY'] = 'sua_chave_secreta_super_segura'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Inicializa DBManager para perguntas do JSON
db_perguntas = DBManager("data/perguntas.json")

# 🔵 API que lê o arquivo perguntas.json
@app.route('/api/perguntas')
def get_perguntas():
    try:
        # Caminho absoluto para evitar erros
        caminho = os.path.join(app.root_path, 'data', 'perguntas.json')
        
        # Verifica se o arquivo existe
        if not os.path.exists(caminho):
            return jsonify({"error": "Arquivo de perguntas não encontrado"}), 404
            
        with open(caminho, 'r', encoding='utf-8') as f:
            perguntas = json.load(f)
            
            # Validação básica do formato
            if not isinstance(perguntas, list):
                return jsonify({"error": "Formato inválido: deve ser uma lista"}), 500
                
            return jsonify(perguntas)
            
    except json.JSONDecodeError:
        return jsonify({"error": "Arquivo JSON inválido"}), 500
    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

# MODELOS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Pergunta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    enunciado = db.Column(db.String(500), nullable=False)
    opcao_a = db.Column(db.String(200), nullable=False)
    opcao_b = db.Column(db.String(200), nullable=False)
    opcao_c = db.Column(db.String(200), nullable=False)
    opcao_d = db.Column(db.String(200), nullable=False)
    resposta_correta = db.Column(db.String(1), nullable=False)

# Criar banco de dados e admin se não existir
with app.app_context():
    db.create_all()
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin', password=generate_password_hash('admin123'))
        db.session.add(admin)
        db.session.commit()

# ROTAS PÚBLICAS
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    perguntas = Pergunta.query.all()
    return render_template('quiz.html', perguntas=perguntas)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            flash('Login realizado com sucesso!', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Usuário ou senha incorretos', 'danger')
    return render_template('login.html')

# ROTAS ADMIN
@app.route('/admin/dashboard')
def admin_dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    perguntas = Pergunta.query.all()
    return render_template('admin/dashboard.html', perguntas=perguntas)

@app.route('/admin/nova', methods=['GET', 'POST'])
def nova_pergunta():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        nova = Pergunta(
            enunciado=request.form['enunciado'],
            opcao_a=request.form['opcao_a'],
            opcao_b=request.form['opcao_b'],
            opcao_c=request.form['opcao_c'],
            opcao_d=request.form['opcao_d'],
            resposta_correta=request.form['resposta_correta']
        )
        db.session.add(nova)
        db.session.commit()
        flash('Pergunta adicionada com sucesso!', 'success')
        return redirect(url_for('admin_dashboard'))

    return render_template('admin/nova_pergunta.html')

@app.route('/admin/editar/<int:id>', methods=['GET', 'POST'])
def editar_pergunta(id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    pergunta = Pergunta.query.get_or_404(id)

    if request.method == 'POST':
        pergunta.enunciado = request.form['enunciado']
        pergunta.opcao_a = request.form['opcao_a']
        pergunta.opcao_b = request.form['opcao_b']
        pergunta.opcao_c = request.form['opcao_c']
        pergunta.opcao_d = request.form['opcao_d']
        pergunta.resposta_correta = request.form['resposta_correta']
        db.session.commit()
        flash('Pergunta atualizada com sucesso!', 'success')
        return redirect(url_for('admin_dashboard'))

    return render_template('admin/editar_pergunta.html', pergunta=pergunta)

@app.route('/admin/excluir/<int:id>')
def excluir_pergunta(id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    pergunta = Pergunta.query.get_or_404(id)
    db.session.delete(pergunta)
    db.session.commit()
    flash('Pergunta excluída com sucesso!', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('Você foi desconectado', 'info')
    return redirect(url_for('home'))

# RODAR
if __name__ == '__main__':
    app.run(debug=True)
