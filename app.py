from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

app = Flask(__name__)

# Configuração da conexão com o MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['nome_do_banco_de_dados']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/adicionar', methods=['GET', 'POST'])
def adicionar_perfil():
    if request.method == 'POST':
        perfil = {
            'categoria': request.form['categoria'],
            'perfil_tr': request.form['perfil-tr'],
            'senioridade': request.form['senioridade'],
            'formacao': request.form['formacao'],
            'tempo_experiencia': request.form['tempo-experiencia'],
            'certificacoes': request.form['certificacoes'],
            'responsabilidades': request.form['responsabilidades']
        }
        db.perfis.insert_one(perfil)
        return redirect(url_for('home'))
    return send_from_directory('Static/Pag_Editar', 'index.html')

@app.route('/buscar', methods=['GET', 'POST'])
def buscar_perfil():
    if request.method == 'POST':
        query = request.form['categoria']
        perfil = db.perfis.find_one({'categoria': query})
        return render_template('resultado.html', perfil=perfil)
    return send_from_directory('Static/Pag_Busca', 'index.html')

@app.route('/editar/<perfil_id>', methods=['GET', 'POST'])
def editar_perfil(perfil_id):
    if request.method == 'POST':
        db.perfis.update_one(
            {'_id': ObjectId(perfil_id)},
            {'$set': {
                'categoria': request.form['categoria'],
                'perfil_tr': request.form['perfil-tr'],
                'senioridade': request.form['senioridade'],
                'formacao': request.form['formacao'],
                'tempo_experiencia': request.form['tempo-experiencia'],
                'certificacoes': request.form['certificacoes'],
                'responsabilidades': request.form['responsabilidades']
            }}
        )
        return redirect(url_for('home'))
    perfil = db.perfis.find_one({'_id': ObjectId(perfil_id)})
    return send_from_directory('Static/Pag_Editar', 'index.html', perfil=perfil)

@app.route('/excluir/<perfil_id>', methods=['POST'])
def excluir_perfil(perfil_id):
    db.perfis.delete_one({'_id': ObjectId(perfil_id)})
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
