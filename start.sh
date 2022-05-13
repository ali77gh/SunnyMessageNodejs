
# make seprated processes for services
node signaling/signaling.js & \
node stun/stun.js & \
node public/public.js