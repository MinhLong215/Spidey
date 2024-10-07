# Sử dụng Node.js image
FROM node:14

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code frontend vào container
COPY . .

# Build project React
RUN npm run build

# Expose port cho frontend
EXPOSE 3000

# Lệnh khởi chạy frontend server
CMD ["npm", "start"]
