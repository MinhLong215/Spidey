# Sử dụng Node.js image
FROM node:14

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy tất cả code vào container
COPY . .

# Expose port để container có thể truy cập
EXPOSE 3003

# Lệnh khởi chạy backend server
CMD ["npm", "start"]
