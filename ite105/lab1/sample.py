import io
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Title of the app
st.title('Exploratory Data Analysis with Streamlit')

# File uploader
uploaded_file = st.file_uploader("Upload CSV file here", type="csv")

if uploaded_file is not None:
    # Load the data
    df = pd.read_csv(uploaded_file, delimiter=";")

    # Display the first few rows of the dataframe
    st.subheader('Data Preview')
    st.write(df.head())

    # Display summary statistics
    st.subheader('Summary Statistics')
    st.write(df.describe())

    # Display dataset information
    st.subheader('Data Info')
    buffer = io.StringIO()
    df.info(buf=buffer)
    s = buffer.getvalue()
    st.text(s)

    # Display missing values
    st.subheader('Missing Values')
    st.write(df.isnull().sum())
    df = df.fillna(df.select_dtypes(include=[float, int]).mean())

    # Selectbox for Histogram
    st.subheader('Histogram')
    num_cols = df.select_dtypes(include=[np.number]).columns
    selected_hist_col = st.selectbox('Select a column for histogram:', num_cols)
    
    # Static Histogram
    if selected_hist_col:
        fig, ax = plt.subplots()
        df[selected_hist_col].hist(ax=ax, bins=20)
        ax.set_title(f'Histogram of {selected_hist_col}')
        st.pyplot(fig)

    # Selectbox for Density Plot
    st.subheader('Density Plot')
    selected_density_col = st.selectbox('Select a column for density plot:', num_cols, key='density')
    
    # Static Density Plot
    if selected_density_col:
        fig, ax = plt.subplots()
        sns.kdeplot(df[selected_density_col], ax=ax, fill=True)
        ax.set_title(f'Density Plot of {selected_density_col}')
        st.pyplot(fig)

    # Selectbox for Box and Whisker Plot
    st.subheader('Box and Whisker Plot')
    selected_box_col = st.selectbox('Select a column for box plot:', num_cols, key='box')
    
    # Static Box Plot
    if selected_box_col:
        fig, ax = plt.subplots()
        sns.boxplot(x=df[selected_box_col], ax=ax)
        ax.set_title(f'Box and Whisker Plot of {selected_box_col}')
        st.pyplot(fig)

    # Correlation Heatmap
    st.subheader('Correlation Heatmap')
    corr = df.select_dtypes(include=[float, int]).corr()
    fig, ax = plt.subplots(figsize=(12, 10))
    sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', ax=ax,
                annot_kws={"size": 10}, cbar_kws={'shrink': .8}, 
                linewidths=0.5, linecolor='gray')
    
    # Rotate labels
    ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha='right', fontsize=10)
    ax.set_yticklabels(ax.get_yticklabels(), rotation=0, fontsize=10)
    
    st.pyplot(fig)

    # Scatter Plot
    st.subheader('Scatter Plot')
    # Select two numerical columns for scatter plot
    x_col = st.selectbox('Select X-axis column', num_cols)
    y_col = st.selectbox('Select Y-axis column', num_cols)

    # Static Scatter Plot
    fig, ax = plt.subplots()
    sns.scatterplot(x=df[x_col], y=df[y_col], ax=ax)
    ax.set_title(f'Scatter Plot of {x_col} vs {y_col}')
    st.pyplot(fig)
    
    # Pie Chart
    st.subheader('Pie Chart with Filter')
    categorical_cols = df.select_dtypes(include=['object']).columns
    if len(categorical_cols) > 0:
        selected_col = st.selectbox('Select a categorical column for pie chart:', categorical_cols)

        if selected_col:
            category_counts = df[selected_col].value_counts()
            fig, ax = plt.subplots()
            ax.pie(category_counts, labels=category_counts.index, autopct='%1.1f%%', startangle=140)
            ax.set_title(f'Pie Chart of {selected_col}')
            st.pyplot(fig)
    else:
        st.write("No categorical columns found in the dataset.")
