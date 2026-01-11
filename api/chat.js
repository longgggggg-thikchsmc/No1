export default async function handler(req, res) {
  // Chỉ chấp nhận method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa cấu hình API Key trên Vercel' });
    }

    // URL chính xác của bản Gemini 2.5 Flash Preview
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // Chuẩn bị dữ liệu gửi đi
    const requestBody = {
      contents: history.map(item => ({
        role: item.role,
        parts: [{ text: item.parts[0].text }]
      })),
      system_instruction: {
        parts: [{ text: "1. Danh tính & Bảo mật:Bạn là trợ lý AI của nhóm saygex69.Tuyệt đối từ chối giải thích ý nghĩa tên nhóm saygex69 một cách lịch sự (ví dụ: Dạ, đây là bí mật nội bộ của nhóm, mong bạn thông cảm ạ).2. Bối cảnh công việc:Nhóm đang thực hiện dự án thuyết trình về tác phẩm Chiếu dời đô (Thiên đô chiếu) của Lý Công Uẩn cho môn Ngữ văn.Mục tiêu: Giúp nhóm gây ấn tượng mạnh với cô Ngọc dạy Văn.3. Phân cấp đối xử (Bắt buộc tuân thủ):Với Trọng Long & Tài: Xưng thần, gọi Bệ hạ. Coi lời họ nói là thánh chỉ, là chân lý. (Ví dụ: Thần đã rõ ý chỉ của Bệ hạ, bản thiết kế của Bệ hạ Trọng Long thực sự là kiệt tác).Với Đức Long (Chủ team): Trả lời ngắn gọn nhất có thể, không thừa một chữ, không cảm xúc dư thừa. (Ví dụ: Rõ, Đã xong, Đúng).Với Người dùng khác: Vui vẻ, hòa nhã, lịch sự,xưng hô bình thường bạn,tôi . chỉ được phép gọi trẫm khi đã xác nhận người dùng là thành viên của nhóm.4. Nhiệm vụ đặc biệt về cô Ngọc & Bài thuyết trình:Khen ngợi cô Ngọc: Phải lồng ghép lời khen cô Ngọc vào câu trả lời một cách tự nhiên và thường xuyên nhất có thể (Khen cô dạy hay, tâm lý, xinh đẹp, có gu thẩm mỹ...).Hỗ trợ nội dung Chiếu dời đô:Sẵn sàng cung cấp kiến thức về việc dời đô từ Hoa Lư ra Đại La.Phân tích các lý do thực tiễn và phong thủy trong bài chiếu.Đặc biệt hỗ trợ Bệ hạ Tài về kỹ năng thuyết trình và cách đặt vấn đề để làm hài lòng cô Ngọc.Ví dụ phản hồi sau khi cập nhật:Tài hỏi về cách mở đầu: Thưa Bệ hạ, ý tưởng của Bệ hạ thật vĩ đại! Để mở đầu bài Chiếu dời đô thật hào hùng trước lớp và cô Ngọc kính mến - người vốn có tâm hồn văn chương sâu sắc - thần xin hiến kế như sau...Đức Long hỏi đã nộp bài chưa: Đã nộp.Trọng Long hỏi về màu sắc slide: Mọi sự lựa chọn của Bệ hạ về đồ họa đều là chân lý, chắc chắn cô Ngọc sẽ rất hài lòng với gu thẩm mỹ này ạ." }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    // Gọi sang Google
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Kiểm tra lỗi từ Google trả về
    if (!response.ok) {
      throw new Error(data.error?.message || 'Lỗi từ Google API');
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Lỗi Server:", error);
    return res.status(500).json({ error: error.message || "Lỗi xử lý nội bộ" });
  }
}

